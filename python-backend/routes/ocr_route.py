from flask import Blueprint, request, jsonify
import logging
from utils.ocr_processor import OCRProcessor
from utils.gemini_processor import GeminiProcessor
from utils.attendance_calculator import AttendanceCalculator
from models.weekly_schedule import WeeklySchedule
from models.attendance import AttendanceRecord
from PIL import Image
import tempfile
import os

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
ocr_bp = Blueprint('ocr', __name__)

# Initialize processors and models
ocr_processor = OCRProcessor()
gemini_processor = GeminiProcessor()
attendance_calculator = AttendanceCalculator()
weekly_schedule = WeeklySchedule()
attendance_record = AttendanceRecord()

@ocr_bp.route('/analyze', methods=['POST'])
def analyze_attendance():
    """
    Endpoint to process OCR on attendance screenshots and calculate recommendations
    """
    try:
        logger.info("Received attendance analysis request")
        
        # Check if image is in request
        if 'screenshot' not in request.files:
            return jsonify({"error": "No screenshot provided"}), 400
        
        # Get parameters
        image_file = request.files['screenshot']
        student_id = request.form.get('student_id', '123')
        department = request.form.get('department')
        desired_attendance = float(request.form.get('desiredAttendance', 75))
        weeks_remaining = int(request.form.get('timeFrame', 4))
        
        if not department:
            return jsonify({"error": "Department is required"}), 400
        
        # Process image with OCR
        try:
            # Create a temporary file
            fd, temp_path = tempfile.mkstemp(suffix='.png')
            os.close(fd)
            
            # Save and process the image
            image = Image.open(image_file)
            image.convert('RGB').save(temp_path)
            
            # Extract text with OCR
            logger.info("Processing image with OCR")
            extracted_text = ocr_processor.process_image(temp_path)
            
            # Clean up
            os.unlink(temp_path)
            
            # If the OCR processor returned a dictionary (parsed data), use it directly
            if isinstance(extracted_text, dict):
                structured_data = extracted_text
            else:
                # Otherwise, process the text with Gemini
                structured_data = gemini_processor.process_text(extracted_text)
            
            # Ensure student_id is set
            structured_data['student_id'] = student_id
            
            # Calculate recommendations
            recommendations = attendance_calculator.calculate_allowed_skips(
                department,
                structured_data,
                desired_attendance,
                weeks_remaining
            )
            
            # Save to database
            result_data = {
                'attendance': structured_data,
                'recommendations': recommendations
            }
            record_id = attendance_record.save_record(student_id, department, result_data)
            
            return jsonify({
                "success": True,
                "data": result_data,
                "record_id": record_id
            })
            
        except Exception as e:
            logger.error(f"Processing failed: {str(e)}")
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@ocr_bp.route('/records/<student_id>', methods=['GET'])
def get_student_records(student_id):
    """Get attendance records for a student"""
    try:
        limit = int(request.args.get('limit', 10))
        records = attendance_record.get_student_records(student_id, limit)
        return jsonify({
            "success": True,
            "data": records
        })
    except Exception as e:
        logger.error(f"Error fetching records: {str(e)}")
        return jsonify({"error": str(e)}), 500