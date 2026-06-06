import boto3

s3 = boto3.client('s3')

s3.upload_file(
    'imagem.png',
    'spacewars-assets',
    'imagem.png'
)

print("Upload realizado")