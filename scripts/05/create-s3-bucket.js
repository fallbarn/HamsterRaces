// Imports
const {
  CreateBucketCommand
} = require('@aws-sdk/client-s3')
const { sendS3Command } = require('./helpers')

// Declare local variables
const bucketName = 'hamster-bucket-simonellis-DDAD'

async function execute () {
  try {
    const response = await createBucket(bucketName)
    console.log('Created S3 Bucket with:', response)
  } catch (err) {
    console.error('Error creating S3 Bucket:', err)
  }
}

async function createBucket (bucketName) {
  const params = {
    Bucket:bucketName,
    ACL: 'public-read'
  }

  const command = new CreateBucketCommand(params) {
    sendS3Command(command);
  }
}

execute()
