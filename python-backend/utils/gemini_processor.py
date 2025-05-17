import google.generativeai as genai
import os
import json
import logging
import re
from typing import Dict, Any
from utils.ocr_processor import OCRProcessor

logger = logging.getLogger(__name__)

class GeminiProcessor:
    def __init__(self):
        # Get API key from environment variable
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY environment variable is not set, using fallback parsing only")
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')

        # Initialize OCR processor for fallback parsing
        self.ocr_processor = OCRProcessor()

    def process_text(self, text: str) -> Dict[str, Any]:
        """
        Process the OCR text using Gemini to extract structured attendance data.
        Falls back to OCR processor if Gemini is not available or fails.
        """
        # Check if Gemini model is available
        if not hasattr(self, 'model'):
            logger.info("Gemini model not available, using OCR processor directly")
            return self._fallback_parsing(text)

        try:
            prompt = f"""
            Extract attendance information from the following text and convert it to JSON format.
            The output should follow this exact structure:
            {{
                "student_id": "string",
                "records": [
                    {{
                        "subjectName": "string",
                        "classType": "THEORY or PRACTICAL",
                        "attended": number,
                        "total": number,
                        "percentage": number
                    }}
                ],
                "overallPercentage": number
            }}

            Rules:
            1. For subject names, use the course code (e.g., "IT101", "HS121")
            2. Class type should be either "THEORY" for lectures or "PRACTICAL" for labs
            3. Calculate percentage as (attended/total * 100) rounded to 2 decimal places
            4. Overall percentage is the sum of all attended classes divided by the sum of all total classes
            5. Extract student ID if present, otherwise use "unknown"

            Text to process:
            {text}

            Return only valid JSON, no additional text or explanations. Do not include any markdown formatting.
            """

            response = self.model.generate_content(prompt)

            # Extract JSON from the response
            try:
                # Clean the response text to ensure it's valid JSON
                json_str = response.text.strip()

                # Handle markdown code blocks
                if '```' in json_str:
                    # Extract content between code blocks
                    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', json_str)
                    if match:
                        json_str = match.group(1).strip()

                # Remove any leading/trailing text that's not part of the JSON
                json_str = self._extract_json(json_str)

                if not json_str:
                    logger.error("Could not extract valid JSON from response")
                    # Fall back to parsing the text directly
                    return self._fallback_parsing(text)

                result = json.loads(json_str)

                # Validate the structure
                self._validate_json_structure(result)

                # Log successful parsing
                logger.info(f"Successfully parsed attendance data with Gemini: {len(result.get('records', [])) if result else 0} subjects found")

                return result

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Gemini response as JSON: {e}")
                logger.error(f"Raw response: {response.text}")
                # Fall back to parsing the text directly
                return self._fallback_parsing(text)

        except Exception as e:
            logger.error(f"Error processing text with Gemini: {str(e)}")
            # Fall back to parsing the text directly
            return self._fallback_parsing(text)

    def _extract_json(self, text: str) -> str:
        """
        Try to extract JSON from text that might contain other content
        """
        # Try to find JSON object by locating matching braces
        try:
            start_idx = text.find('{')
            if start_idx == -1:
                return ""

            # Count opening and closing braces to find the end of the JSON object
            depth = 0
            for i in range(start_idx, len(text)):
                if text[i] == '{':
                    depth += 1
                elif text[i] == '}':
                    depth -= 1
                    if depth == 0:
                        return text[start_idx:i+1]

            return ""
        except Exception:
            return ""

    def _fallback_parsing(self, text: str) -> Dict[str, Any]:
        """
        Fallback method to parse attendance information directly from OCR text
        when Gemini fails to return valid JSON
        """
        logger.info("Using fallback parsing for attendance data")
        
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
                    percentage = round((attended / total) * 100, 2) if total > 0 else 0
                    
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
        overall_percentage = round((total_attended / total_classes) * 100, 2) if total_classes > 0 else 0
        
        return {
            "student_id": "unknown",  # Placeholder, would be determined by user authentication
            "records": records,
            "overallPercentage": overall_percentage
        }
            
    def _validate_json_structure(self, data: Dict[str, Any]) -> None:
        """
        Validate the JSON structure matches our expected format
        """
        required_keys = {'student_id', 'records', 'overallPercentage'}
        if not all(key in data for key in required_keys):
            raise ValueError("Missing required keys in JSON structure")

        if not isinstance(data['records'], list):
            raise ValueError("'records' must be an array")

        for record in data['records']:
            required_record_keys = {
                'subjectName', 'classType', 'attended',
                'total', 'percentage'
            }
            if not all(key in record for key in required_record_keys):
                raise ValueError("Missing required keys in record structure") 