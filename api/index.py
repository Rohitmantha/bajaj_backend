from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Sample user data (Replace with real data or a database lookup)
user_data = {
    "user_id": "john_doe_17091999",
    "email": "john@xyz.com",
    "roll_number": "ABCD123"
}

@app.route('/bfhl', methods=['GET', 'POST'])
def bfhl():
    if request.method == 'GET':
        # Handle GET request
        response = {
            "operation_code": 1
        }
        return jsonify(response), 200

    if request.method == 'POST':
        # Handle POST request
        try:
            # Parse incoming JSON data
            data = request.json.get('data', [])

            if not isinstance(data, list):
                raise ValueError("Data should be a list")

            # Separate numbers and alphabets
            numbers = [item for item in data if item.isdigit()]
            alphabets = [item for item in data if item.isalpha()]

            # Find the highest lowercase alphabet
            lowercase_alphabets = [ch for ch in alphabets if ch.islower()]
            highest_lowercase = max(lowercase_alphabets) if lowercase_alphabets else None

            response = {
                "is_success": True,
                "user_id": user_data["user_id"],
                "email": user_data["email"],
                "roll_number": user_data["roll_number"],
                "numbers": numbers,
                "alphabets": alphabets,
                "highest_lowercase_alphabet": [highest_lowercase] if highest_lowercase else []
            }

        except Exception as e:
            response = {
                "is_success": False,
                "message": str(e)
            }

        return jsonify(response), 200

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
