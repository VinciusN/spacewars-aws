import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('rank')

table.put_item(
    Item={
        "id": "JOGADOR001",
        "score": 5020,
        "timestamp": "30 de maio de 2026 às 12:52:44 UTC-3"
    }
)

print("Ranking atualizado")