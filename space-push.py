import boto3

dynamodb = boto3.resource(
    'dynamodb',
    region_name='sa-east-1'
)

table = dynamodb.Table('rank')

table.put_item(
    Item={
        "id": "JOGADOR001",
        "score": 5000,
        "timestamp": "2026-05-30"
    }
)

print("Ranking atualizado")