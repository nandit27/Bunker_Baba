import easyocr
import numpy as np
import cv2
import re
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OCRProcessor:
    def __init__(self):
        self.reader = None
        
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
            
            # Improve image quality for OCR
            gray = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Perform OCR
            logger.info("Running OCR on image")
            ocr_results = self.reader.readtext(thresh, detail=0)
            
            # Convert results to a single string for easier parsing
            text = ' '.join(ocr_results)
            logger.info(f"OCR completed. Extracted text: {text[:100]}...")
            
            # Return the raw text for further processing by Gemini
            return text
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise
    
    def parse_attendance_data(self, text):
        """
        Parse the extracted text into structured attendance data
        
        Args:
            text: The OCR extracted text
            
        Returns:
            dict: Structured attendance data
        """
        # Example pattern for subject code
        subject_pattern = r'((?:HS|IT|MA|CSE|EC|DS|WT)\d+(?:\.\d+)?)'
        attendance_pattern = r'(\d+)\s*\/\s*(\d+)'
        
        lines = text.split('\n')
        if not lines:
            lines = text.split(' ')
        
        records = []
        total_attended = 0
        total_classes = 0
        
        for line in lines:
            # Look for subject codes
            subject_match = re.search(subject_pattern, line)
            if subject_match:
                subject_name = subject_match.group(1).strip()
                
                # Determine class type
                class_type = "THEORY"
                if "LAB" in line or "PRACTICAL" in line:
                    class_type = "PRACTICAL"
                
                # Look for attendance numbers (X/Y format)
                attendance_match = re.search(attendance_pattern, line)
                if attendance_match:
                    attended = int(attendance_match.group(1))
                    total = int(attendance_match.group(2))
                    
                    # Calculate percentage
                    percentage = (attended / total) * 100 if total > 0 else 0
                    
                    records.append({
                        "subjectName": subject_name,
                        "classType": class_type,
                        "attended": attended,
                        "total": total,
                        "percentage": percentage
                    })
                    
                    total_attended += attended
                    total_classes += total
        
        # Calculate overall percentage
        overall_percentage = (total_attended / total_classes) * 100 if total_classes > 0 else 0
        
        return {
            "student_id": "123",  # Placeholder, would be determined by user authentication
            "records": records,
            "overallPercentage": overall_percentage
        } 