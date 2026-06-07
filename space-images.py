import boto3

s3 = boto3.client('s3')

s3.upload_file(
    'spaceship.png',
    'spacewars-assets',
    'spaceship.png'
)