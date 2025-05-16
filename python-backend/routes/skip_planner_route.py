from flask import Blueprint, request, jsonify
import logging
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
skip_planner_bp = Blueprint('skip_planner', __name__)

# Initialize Gemini
api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

@skip_planner_bp.route('/plan-skips', methods=['POST'])
def plan_skips():
    """
    Endpoint to generate intelligent class skip recommendations using Gemini
    """
    try:
        logger.info("Received skip planning request")
        
        # Get request data
        request_data = request.json
        if not request_data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract required parameters
        subjects = request_data.get('subjects', [])
        allowed_skips = request_data.get('allowedSkips', 0)
        distribution_strategy = request_data.get('distributionStrategy', 'balanced')
        
        if not subjects or not isinstance(subjects, list):
            return jsonify({"error": "Subjects array is required"}), 400
        
        # Build prompt for Gemini
        prompt = f"""
        I need to distribute {allowed_skips} allowed class skips across my subjects using a '{distribution_strategy}' strategy.
        
        Here are my subjects with their current attendance and details:
        ```json
        {json.dumps(subjects, indent=2)}
        ```
        
        For each subject, I need you to intelligently recommend how many classes I can skip while maintaining my attendance requirements.
        
        Strategy guidelines:
        - 'balanced': Balance skips based on a combination of current attendance, weekly classes, and priority
        - 'attendance': Give more skips to subjects with higher attendance percentages
        - 'priority': Give more skips to subjects with lower priority (Low > Medium > High)
        - 'classes': Give more skips to subjects with more weekly classes
        
        Rules:
        1. All skips must be assigned (total should equal {allowed_skips})
        2. Never recommend more skips than a subject's weekly classes * 4 (one month)
        3. For subjects with attendance below 75%, recommend fewer skips
        4. For subjects with attendance above 90%, they can be given more skips
        5. Consider subject priority in your distribution (High = attend more, Low = can skip more)
        
        Return a JSON object with the following structure:
        ```json
        {{
          "skipDistribution": {{
            "subjectId1": numberOfSkips,
            "subjectId2": numberOfSkips,
            ...
          }},
          "reasoning": {{
            "subjectId1": "brief explanation of the recommendation",
            "subjectId2": "brief explanation of the recommendation",
            ...
          }},
          "summary": "A brief overall explanation of the distribution strategy",
          "totalSkips": {allowed_skips}
        }}
        ```
        
        Return only the properly formatted JSON, with no additional text or markdown.
        """
        
        # Call Gemini API
        logger.info("Calling Gemini API for skip planning")
        response = model.generate_content(prompt)
        
        # Process the response
        try:
            # Extract JSON from the response
            response_text = response.text.strip()
            
            # Handle markdown code blocks
            if '```' in response_text:
                # Extract content between code blocks
                import re
                match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
                if match:
                    response_text = match.group(1).strip()
            
            # Parse JSON
            result = json.loads(response_text)
            
            # Verify the result structure
            required_keys = {'skipDistribution', 'reasoning', 'summary', 'totalSkips'}
            if not all(key in result for key in required_keys):
                return jsonify({
                    "error": "Invalid response structure from AI",
                    "raw_response": response_text
                }), 500
            
            # Return the processed result
            return jsonify({
                "success": True,
                "data": result
            })
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            return jsonify({
                "error": "Failed to parse AI response",
                "raw_response": response.text
            }), 500
        
    except Exception as e:
        logger.error(f"Error planning skips: {str(e)}")
        return jsonify({"error": str(e)}), 500 