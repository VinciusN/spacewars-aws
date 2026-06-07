from flask import Flask, request, jsonify
import boto3

app = Flask(__name__)

dynamodb = boto3.resource(
    'dynamodb',
    region_name='sa-east-1'
)

table = dynamodb.Table('rank-v2')

@app.route('/save-score', methods=['POST'])
def save_score():

    data = request.json

    table.put_item(
        Item={
            "nickname": data["nickname"],
            "score": int(data["score"])
        }
    )

    return jsonify({"success": True})

@app.route('/ranking')
def ranking():

    response = table.scan()

    items = response['Items']

    items.sort(
        key=lambda x: int(x['score']),
        reverse=True
    )

    return jsonify(items[:10])