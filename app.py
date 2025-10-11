from flask import Flask, request, jsonify, render_template
import requests
from flask_cors import CORS
import logging
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # allows frontend requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 🔐 OpenRouter API key - You should use environment variable for production
# Load variables from .env (if present)
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logger.warning(
        "OPENROUTER_API_KEY not found in environment. Set it in your .env file or the system environment for production."
    )

@app.route("/")
def home():
    """Serve the main HTML page"""
    try:
        return render_template("index.html")
    except Exception as e:
        logger.error(f"Error serving home page: {str(e)}")
        return jsonify({"error": "Could not load page"}), 500

@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat requests and proxy to OpenRouter API"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        user_message = data.get("message")
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
            
        if not isinstance(user_message, str) or len(user_message.strip()) == 0:
            return jsonify({"error": "Message must be a non-empty string"}), 400

        # Log the request
        logger.info(f"Processing chat request: {user_message[:50]}...")

        # Validate API key
        if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "your-api-key-here":
            return jsonify({"error": "OpenRouter API key not configured"}), 500

        # Prepare request to OpenRouter
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": request.host_url,  # Optional: for OpenRouter analytics
            "X-Title": "Flask Chat App"  # Optional: for OpenRouter analytics
        }
        
        payload = {
            "model": "openai/gpt-3.5-turbo",  # You can also use "openai/gpt-4" for better results
            "messages": [{"role": "user", "content": user_message.strip()}],
            "max_tokens": 1000,
            "temperature": 0.7
        }

        # Make request to OpenRouter API with timeout
        logger.info("Making request to OpenRouter API...")
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30  # 30 second timeout
        )

        # Log response status
        logger.info(f"OpenRouter API responded with status: {response.status_code}")

        # Handle response
        if response.status_code == 200:
            try:
                response_data = response.json()
                logger.info("Successfully got response from OpenRouter API")
                return jsonify(response_data)
            except ValueError as e:
                logger.error(f"Failed to parse JSON response: {str(e)}")
                return jsonify({"error": "Invalid JSON response from API"}), 500
                
        elif response.status_code == 401:
            logger.error("API key authentication failed")
            return jsonify({"error": "API authentication failed. Please check your API key."}), 401
            
        elif response.status_code == 429:
            logger.error("API rate limit exceeded")
            return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429
            
        elif response.status_code == 500:
            logger.error("OpenRouter API server error")
            return jsonify({"error": "API server error. Please try again later."}), 500
            
        else:
            logger.error(f"API request failed with status {response.status_code}: {response.text}")
            return jsonify({"error": f"API request failed with status {response.status_code}"}), response.status_code

    except requests.exceptions.Timeout:
        logger.error("Request to OpenRouter API timed out")
        return jsonify({"error": "Request timed out. Please try again."}), 504
        
    except requests.exceptions.ConnectionError:
        logger.error("Connection error when calling OpenRouter API")
        return jsonify({"error": "Could not connect to API. Please check your internet connection."}), 503
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error when calling OpenRouter API: {str(e)}")
        return jsonify({"error": f"Network error: {str(e)}"}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Flask Chat App is running"
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    # Get configuration from environment variables
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))
    
    logger.info(f"Starting Flask app on {host}:{port} (debug={debug_mode})")
    
    app.run(
        debug=debug_mode, 
        host=host, 
        port=port,
        threaded=True  # Enable threading for better performance
    )