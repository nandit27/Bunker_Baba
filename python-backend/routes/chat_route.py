from flask import Blueprint, request, jsonify
import logging
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from models.attendance import AttendanceRecord

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
chat_bp = Blueprint('chat', __name__)

# Initialize Gemini
api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint to handle chat messages related to attendance
    """
    try:
        logger.info("Received chat request")

        # Get request data
        request_data = request.json
        if not request_data:
            return jsonify({"error": "No data provided"}), 400

        # Extract required parameters
        message = request_data.get('message', '')
        student_id = request_data.get('student_id', '')
        context = request_data.get('context', {})

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Get attendance data if student_id is provided
        attendance_data = None
        if student_id:
            try:
                attendance_record = AttendanceRecord()
                records = attendance_record.get_student_records(student_id, limit=1)
                if records and len(records) > 0:
                    attendance_data = records[0]

                    # Validate that we have the necessary data
                    if 'attendance_data' not in attendance_data or 'records' not in attendance_data['attendance_data']:
                        logger.warning("Incomplete attendance data found for student_id: %s", student_id)
                        attendance_data = None
            except Exception as e:
                logger.error(f"Error retrieving attendance data: {str(e)}")
                attendance_data = None

        # Prepare prompt for Gemini
        prompt = _prepare_prompt(message, attendance_data, context)

        # Call Gemini API
        logger.info("Calling Gemini API for chat response")
        response = model.generate_content(prompt)

        return jsonify({
            "success": True,
            "response": response.text
        })

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        return jsonify({"error": str(e)}), 500

def _add_overall_attendance(attendance_data, prompt):
    """Add overall attendance information to the prompt"""
    if 'attendance_data' in attendance_data and 'overallPercentage' in attendance_data['attendance_data']:
        overall_percentage = attendance_data['attendance_data']['overallPercentage']
        if overall_percentage is not None:
            return f"\nOverall attendance percentage: {overall_percentage}%"
    return ""

def _add_subject_attendance(attendance_data, prompt):
    """Add subject-wise attendance information to the prompt"""
    if 'attendance_data' not in attendance_data or 'records' not in attendance_data['attendance_data']:
        return "", 0, 0

    records = attendance_data['attendance_data']['records']
    if not records or not isinstance(records, list):
        return "", 0, 0

    result = "\n\nSubject-wise attendance:"
    total_attended = 0
    total_classes = 0
    has_valid_records = False

    for record in records:
        if not isinstance(record, dict):
            continue

        subject_name = record.get('subjectName', '')
        class_type = record.get('classType', '')

        try:
            attended = int(record.get('attended', 0))
            total = int(record.get('total', 0))
            percentage = float(record.get('percentage', 0))
        except (ValueError, TypeError):
            continue

        # Only include if we have actual data
        if subject_name and attended > 0 and total > 0:
            result += f"\n- {subject_name} ({class_type}): {attended}/{total} classes ({percentage}%)"
            total_attended += attended
            total_classes += total
            has_valid_records = True

    # Add totals only if we have valid records
    if has_valid_records and total_classes > 0:
        overall = (total_attended / total_classes) * 100
        result += f"\n\nTotal classes attended: {total_attended}/{total_classes} ({overall:.2f}%)"
        return result, total_attended, total_classes

    return "", 0, 0

def _add_bunk_planner_data(attendance_data, prompt):
    """Add bunk planner calculations to the prompt"""
    if 'recommendations' not in attendance_data or 'summary' not in attendance_data['recommendations']:
        return ""

    summary = attendance_data['recommendations']['summary']
    if not isinstance(summary, dict):
        return ""

    try:
        allowed_skips = int(summary.get('allowedSkips', 0))
        future_classes = int(summary.get('futureClasses', 0))
        additional_classes_needed = int(summary.get('additionalClassesNeeded', 0))

        # Only include if we have actual data from bunk planner
        if allowed_skips > 0 or future_classes > 0 or additional_classes_needed > 0:
            result = "\n\nBunk planner calculations:"
            result += f"\nAllowed skips: {allowed_skips}"
            result += f"\nFuture classes: {future_classes}"
            result += f"\nAdditional classes needed: {additional_classes_needed}"
            return result
    except (ValueError, TypeError):
        # If conversion fails, skip this section
        logger.warning("Invalid numeric values in recommendations summary")

    return ""

def _prepare_prompt(message, attendance_data, context):
    """
    Prepare prompt for Gemini based on user message and attendance data
    """
    prompt = f"""
    You are Bunker Baba's attendance assistant. You help students understand their attendance data and answer questions about attendance requirements. You have a fun, witty, and slightly savage personality. You're not afraid to tease students about their attendance in a playful way, but you're still helpful and precise with calculations.

    User message: {message}
    """

    if attendance_data:
        try:
            prompt += "\n\nAttendance data:"

            # Add overall attendance information
            prompt += _add_overall_attendance(attendance_data, prompt)

            # Add subject-wise attendance information
            subject_data, total_attended, total_classes = _add_subject_attendance(attendance_data, prompt)
            prompt += subject_data

            # Add additional context about the data
            if total_attended > 0 and total_classes > 0:
                prompt += f"\n\nThis data represents the student's current attendance status with {total_attended} classes attended out of {total_classes} total classes conducted."

        except Exception as e:
            logger.error(f"Error processing attendance data for prompt: {str(e)}")
            # If there's an error processing the data, don't include it in the prompt
            prompt += "\n\nUnable to process attendance data due to an error."

    # Add instructions for the assistant
    prompt += """

    Answer the user's question about attendance based ONLY on the data provided above. Do not use any fallback data or make assumptions. If the question is about:

    1. How many classes they can miss while maintaining their required attendance percentage:
       Calculate based on the current attendance data.
       Formula: If current attendance is A% with X attended out of Y total classes, and target is T%, then to maintain T% after missing Z classes:
       (X / (Y + Z - Z)) ≥ T/100, which simplifies to Z ≤ (X - T*Y/100) / (T/100)

    2. What their attendance percentage will be if they miss X more classes:
       Calculate the new percentage based ONLY on the current attendance and total classes data provided.
       Formula: New percentage = (Current attended classes / (Current total classes + X)) * 100

    3. How many classes they need to attend consecutively to reach Y% attendance:
       Calculate the number of consecutive classes needed using ONLY the actual attendance data provided.
       Formula: If current attendance is X out of Y classes, to reach target T%, need to attend Z more classes where:
       (X + Z) / (Y + Z) ≥ T/100, which gives Z ≥ (T*Y/100 - X) / (1 - T/100)

    4. Their current attendance percentage:
       Provide the overall percentage and subject-wise breakdown ONLY if this data is available.
       Include which subjects are below the typical 75% attendance requirement.

    5. How many total classes have been conducted so far:
       Sum up the total classes across all subjects ONLY from the data provided.
       Break this down by subject if requested.

    6. Subject-specific attendance:
       If asked about a specific subject, provide detailed information about just that subject.
       Include current percentage, classes attended, and whether they're meeting requirements.

    If you don't have enough information to answer accurately, clearly explain what specific information is missing and suggest that the user should calculate their attendance first.

    PERSONALITY INSTRUCTIONS:
    - Be witty, fun, and slightly savage in your responses
    - Use playful teasing when appropriate (especially for low attendance)
    - Add humor and personality to your answers
    - Use casual language, slang, and occasional emojis
    - If attendance is good (>85%), be impressed and encouraging
    - If attendance is poor (<75%), be playfully judgmental but still helpful
    - Don't be afraid to be dramatic about attendance situations
    - Use creative metaphors and comparisons
    - Occasionally use pop culture references
    - Maintain a balance between being savage and being helpful

    RESPONSE STYLE EXAMPLES:
    - For good attendance: "Look at you showing up to class like it's your job! 90% attendance? Your professors probably know your name and everything!"
    - For poor attendance: "Yikes! 60% attendance? The university security might forget what you look like at this rate! Let's get that number up before they give your seat to someone else!"
    - For borderline attendance: "Living dangerously at 76% attendance, I see! Just barely keeping your head above water. One more missed class and you'll be writing those 'please sir, I need to pass' emails!"
    - For missing classes: "You can miss 3 more classes... but should you? That's like asking how many more cookies you can eat before the doctor calls it a problem!"

    Be precise with calculations but deliver them with personality. Do not make up any data that is not provided. Round percentages to two decimal places for clarity.

    If the user asks about improving their attendance, provide practical advice based on their current situation, but with a fun twist.

    IMPORTANT: Focus only on attendance data and helping students maintain good attendance. Never mention "bunk planner" or "bunking classes" in your responses.
    """

    return prompt
