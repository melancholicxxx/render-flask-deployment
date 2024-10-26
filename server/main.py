from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient 
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
cors = CORS(app, origins = '*')

# Replace hardcoded connection string with environment variable
MONGODB_URI = os.getenv('MONGODB_URI')

# Add error handling for MongoDB connection
try:
    client = MongoClient(MONGODB_URI)
    # Test the connection
    client.server_info()
    print("Successfully connected to MongoDB Atlas")
except ServerSelectionTimeoutError:  # Changed from ConnectionError
    print("Failed to connect to MongoDB Atlas. Check your connection string and make sure your IP is whitelisted")
    exit(1)

db = client['flaskreactfullstack']
# Add messages collection
messages_collection = db['messages']

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'Darren',
                'Seina',
                'Tim Cook'
            ]
        }
    )

@app.route("/api/sku", methods=['GET'])
def skus():
    return jsonify(
        {
            "skus": [
                'iPhone',
                'Watch',
                'MacBook'
            ]
        }
    )

@app.route("/api/messages", methods=['POST'])
def add_message():
    message = request.json.get('message')
    if message:
        try:
            # Insert message into MongoDB
            result = messages_collection.insert_one({'message': message})
            print(f"Message inserted with ID: {result.inserted_id}")
            return jsonify({"status": "success", "message": "Message stored in MongoDB"})
        except Exception as e:
            print(f"Error inserting message: {str(e)}")
            return jsonify({"status": "error", "message": "Database error"}), 500
    return jsonify({"status": "error", "message": "No message provided"}), 400

@app.route("/api/messages", methods=['GET'])
def get_messages():
    # Retrieve messages from MongoDB
    messages = list(messages_collection.find({}, {'_id': 0, 'message': 1}))
    return jsonify({"messages": [msg['message'] for msg in messages]})

if __name__ == "__main__":
    app.run()