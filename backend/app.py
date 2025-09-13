import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
HOST = os.getenv("FLASK_HOST", "127.0.0.1")
PORT = int(os.getenv("FLASK_PORT", 5000))

app = Flask(__name__)
CORS(app)

client = MongoClient(MONGO_URI)
db = client["testdb"]
collection = db["users"]

# READ: Get all users
@app.route("/users", methods=["GET"])
def get_users():
    users = []
    for u in collection.find():
        u["_id"] = str(u["_id"])
        users.append(u)
    return jsonify(users)

# CREATE: Add new user
@app.route("/users", methods=["POST"])
def add_user():
    data = request.json
    result = collection.insert_one({
        "name": data.get("name"),
        "age": data.get("age"),
        "city": data.get("city")
    })
    return jsonify({"_id": str(result.inserted_id)}), 201

# UPDATE: Edit user by id
@app.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "name": data.get("name"),
            "age": data.get("age"),
            "city": data.get("city")
        }}
    )
    return jsonify({"message": "User updated"})

# DELETE: Delete user by id
@app.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    collection.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "User deleted"})

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
