import easyocr
import numpy as np
import cv2
import re
from PIL import Image
import io
import logging
import string

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OCRProcessor:
    def __init__(self):
        self.reader = None
        # Common subject code prefixes in engineering colleges
        self.subject_prefixes = [
            'HS', 'IT', 'MA', 'CSE', 'CS', 'EC', 'DS', 'WT', 'ME', 'CE', 'EE', 'CH', 'PH',
            'BT', 'MT', 'AE', 'PE', 'IE', 'SE', 'AI', 'ML', 'IOT', 'CY', 'HU', 'SS'
        ]

    def _initialize_reader(self):
        if self.reader is None:
            logger.info("Initializing EasyOCR reader")
            self.reader = easyocr.Reader(['en'], gpu=False)
            logger.info("EasyOCR reader initialized")

    def process_image(self, image_data):
        """
        Process the image data and extract attendance information

        Args:
            image_data: Image data as bytes, file-like object, or file path

        Returns:
            str: Raw OCR text that can be further processed
        """
        self._initialize_reader()

        try:
            # Convert bytes to numpy array or handle file path
            if isinstance(image_data, bytes):
                image = Image.open(io.BytesIO(image_data))
                image_np = np.array(image)
            elif isinstance(image_data, str):  # Treat as file path
                image_np = np.array(Image.open(image_data))
            else:  # Treat as file-like object
                image_np = np.array(Image.open(image_data))

            # Convert to grayscale if not already
            if len(image_np.shape) == 3 and image_np.shape[2] == 3:
                gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
            else:
                gray = image_np

            # Enhanced image preprocessing for better OCR
            # Apply adaptive thresholding for better text extraction
            gray = cv2.GaussianBlur(gray, (3, 3), 0)

            # Try different preprocessing techniques
            # 1. Adaptive thresholding
            adaptive_thresh = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )

            # 2. OTSU thresholding
            _, otsu_thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # 3. Noise removal
            kernel = np.ones((1, 1), np.uint8)
            opening = cv2.morphologyEx(otsu_thresh, cv2.MORPH_OPEN, kernel)

            # Perform OCR on both preprocessed images and combine results
            logger.info("Running OCR on image with multiple preprocessing techniques")

            # Try with adaptive thresholding
            adaptive_results = self.reader.readtext(adaptive_thresh, detail=1,
                                                   paragraph=False,
                                                   allowlist=string.ascii_letters + string.digits + '/-.')

            # Try with OTSU thresholding
            otsu_results = self.reader.readtext(otsu_thresh, detail=1,
                                               paragraph=False,
                                               allowlist=string.ascii_letters + string.digits + '/-.')

            # Try with noise removal
            opening_results = self.reader.readtext(opening, detail=1,
                                                 paragraph=False,
                                                 allowlist=string.ascii_letters + string.digits + '/-.')

            # Combine results from all preprocessing methods
            all_results = adaptive_results + otsu_results + opening_results

            # Extract text and coordinates
            structured_results = []
            for result in all_results:
                bbox, text, confidence = result
                if confidence > 0.3:  # Filter low confidence results
                    structured_results.append({
                        'text': text,
                        'bbox': bbox,
                        'confidence': confidence
                    })

            # Sort results by vertical position (top to bottom)
            structured_results.sort(key=lambda x: x['bbox'][0][1])

            # Group results by lines based on y-coordinate proximity
            line_groups = []
            current_line = []
            last_y = None

            for result in structured_results:
                y_coord = result['bbox'][0][1]

                if last_y is None or abs(y_coord - last_y) < 20:  # Threshold for same line
                    current_line.append(result)
                else:
                    if current_line:
                        line_groups.append(current_line)
                    current_line = [result]

                last_y = y_coord

            if current_line:
                line_groups.append(current_line)

            # Sort each line by horizontal position (left to right)
            for line in line_groups:
                line.sort(key=lambda x: x['bbox'][0][0])

            # Construct lines of text
            text_lines = []
            for line in line_groups:
                line_text = ' '.join([item['text'] for item in line])
                text_lines.append(line_text)

            # Join lines with newlines for better structure
            text = '\n'.join(text_lines)

            logger.info(f"OCR completed. Extracted text: {text[:100]}...")

            # Return the raw text for further processing
            return text

        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise

    def _extract_subject_code(self, text):
        """
        Extract subject code from text using various patterns

        Args:
            text: Text to extract subject code from

        Returns:
            tuple: (subject_code, subject_name)
        """
        # Build a comprehensive regex pattern for subject codes
        prefix_pattern = '|'.join(self.subject_prefixes)

        # Different patterns to try
        patterns = [
            # Standard format: 2-3 letters followed by numbers (e.g., CS101)
            rf'({prefix_pattern})[-\s]*(\d+[A-Z]?(?:\.\d+)?)',

            # Format with slash: CS/101
            rf'({prefix_pattern})\s*/\s*(\d+[A-Z]?(?:\.\d+)?)',

            # Format with dash: CS-101
            rf'({prefix_pattern})\s*-\s*(\d+[A-Z]?(?:\.\d+)?)',

            # Format with space: CS 101
            rf'({prefix_pattern})\s+(\d+[A-Z]?(?:\.\d+)?)'
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                prefix = match.group(1).upper()
                code = match.group(2)
                subject_code = f"{prefix}{code}"

                # Try to extract full subject name if available
                full_name_match = re.search(rf'{prefix}\s*{code}\s*[-:]\s*([A-Za-z\s&]+)', text)
                if full_name_match:
                    subject_name = f"{subject_code} - {full_name_match.group(1).strip()}"
                else:
                    subject_name = subject_code

                return subject_code, subject_name

        # If no match found with specific patterns, try a more general approach
        for prefix in self.subject_prefixes:
            if prefix in text.upper():
                # Find the index of the prefix
                idx = text.upper().find(prefix)
                # Extract a substring that might contain the code
                potential_code = text[idx:idx+10]
                # Try to extract numbers following the prefix
                code_match = re.search(rf'{prefix}\s*(\d+[A-Z]?(?:\.\d+)?)', potential_code, re.IGNORECASE)
                if code_match:
                    subject_code = f"{prefix}{code_match.group(1)}"
                    return subject_code, subject_code

        return None, None

    def _extract_attendance_numbers(self, text):
        """
        Extract attendance numbers from text

        Args:
            text: Text to extract attendance numbers from

        Returns:
            tuple: (attended, total)
        """
        # Different patterns for attendance numbers
        patterns = [
            r'(\d+)\s*\/\s*(\d+)',  # Standard format: 12/15
            r'(\d+)\s*out\s*of\s*(\d+)',  # Text format: 12 out of 15
            r'attended\s*(\d+)\s*out\s*of\s*(\d+)',  # Descriptive: attended 12 out of 15
            r'present\s*(\d+)\s*total\s*(\d+)'  # Alternative: present 12 total 15
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    attended = int(match.group(1))
                    total = int(match.group(2))
                    return attended, total
                except (ValueError, TypeError):
                    continue

        return None, None

    def _determine_class_type(self, text):
        """
        Determine class type from text

        Args:
            text: Text to determine class type from

        Returns:
            str: Class type (THEORY or PRACTICAL)
        """
        practical_indicators = ['lab', 'practical', 'practice', 'workshop', 'prac']

        for indicator in practical_indicators:
            if indicator.upper() in text.upper():
                return "PRACTICAL"

        return "THEORY"

    def parse_attendance_data(self, text):
        """
        Parse the extracted text into structured attendance data

        Args:
            text: The OCR extracted text

        Returns:
            dict: Structured attendance data
        """
        logger.info("Parsing attendance data from OCR text")

        # Split text into lines for processing
        lines = text.split('\n')

        records = []
        total_attended = 0
        total_classes = 0
        processed_subjects = set()  # To avoid duplicates

        # Process each line
        for line in lines:
            # Skip empty lines
            if not line.strip():
                continue

            # Extract subject code and name
            subject_code, subject_name = self._extract_subject_code(line)

            if subject_code:
                # Avoid processing the same subject multiple times
                if subject_code in processed_subjects:
                    continue

                # Determine class type
                class_type = self._determine_class_type(line)

                # Extract attendance numbers
                attended, total = self._extract_attendance_numbers(line)

                if attended is not None and total is not None and total > 0:
                    # Calculate percentage
                    percentage = round((attended / total) * 100, 2)

                    # Add to records
                    records.append({
                        "subjectName": subject_name,
                        "classType": class_type,
                        "attended": attended,
                        "total": total,
                        "percentage": percentage
                    })

                    # Update totals
                    total_attended += attended
                    total_classes += total

                    # Mark subject as processed
                    processed_subjects.add(subject_code)

                    logger.info(f"Extracted subject: {subject_name}, Type: {class_type}, Attendance: {attended}/{total}")

        # Calculate overall percentage
        overall_percentage = round((total_attended / total_classes) * 100, 2) if total_classes > 0 else 0

        logger.info(f"Parsed {len(records)} subjects with overall attendance: {overall_percentage}%")

        return {
            "student_id": "123",  # Placeholder, would be determined by user authentication
            "records": records,
            "overallPercentage": overall_percentage
        }