from flask import jsonify
from services.textizer import textizer_service

def textizer(req, res):
    try:
        # Extract data from request
        request_data = req.get_json()
        
        profile_data = request_data.get('profileData', {})
        last_chatbot_response = request_data.get('lastChatbotResponse', '')
        formatted_context = request_data.get('formattedContext', {})
        
        # Call service function
        formatted_data = textizer_service(profile_data, last_chatbot_response, formatted_context)
        
        # Return response
        return jsonify(formatted_data)
        
    except Exception as e:
        print(f"Controller error: {e}")
        return jsonify({'error': 'Failed to process textizer request'}), 500