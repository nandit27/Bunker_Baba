from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os
from datetime import timedelta
from dotenv import load_dotenv

# Import routes
from routes.ocr_route import ocr_bp
from routes.skip_planner_route import skip_planner_bp
from routes.chat_route import chat_bp

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Set up CORS
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://bunker-baba.netlify.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": timedelta(hours=1)
    }
})

# Register blueprints
app.register_blueprint(ocr_bp, url_prefix='/api')
app.register_blueprint(skip_planner_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')

@app.route('/', methods=['GET'])
def index():
    """Root endpoint to check if API is running"""
    return jsonify({
        "status": "ok",
        "message": "Bunker Baba Python API is running"
    })

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.error(f"Server error: {str(e)}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))  # 10000 is just a dummy default
    logger.info(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
