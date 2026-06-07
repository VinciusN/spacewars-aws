from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

dynamodb = boto3.resource(
    "dynamodb",
    region_name="sa-east-1"
)

table = dynamodb.Table("rank-v2")

@app.route("/save-score", methods=["POST"])
def save_score():

    data = request.json

    nickname = data.get("nickname")
    score = int(data.get("score"))

    table.put_item(
        Item={
            "nickname": nickname,
            "score": score
        }
    )

    return jsonify({
        "success": True
    })

@app.route("/ranking")
def ranking():

    response = table.scan()

    items = response.get("Items", [])

    items.sort(
        key=lambda x: int(x["score"]),
        reverse=True
    )

    return jsonify(items[:10])

@app.route("/nickname/<nickname>")
def nickname_exists(nickname):

    response = table.get_item(
        Key={
            "nickname": nickname
        }
    )

    return jsonify({
        "exists": "Item" in response
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )