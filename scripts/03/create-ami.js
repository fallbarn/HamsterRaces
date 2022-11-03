// Imports
const {
  EC2Client, // sle note: the REST client to talk with AWS EC2 service. (Does a lot of complex encription of commands for sending over the wire)
  CreateImageCommand
} = require('@aws-sdk/client-ec2')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

createImage('i-0be038aea85d70b33', 'hamsterImage')
  .then(() => console.log('Complete'))

async function createImage (seedInstanceId, imageName) {
  const params = {
    InstanceId: seedInstanceId,
    Name: imageName
  }
  const command = new CreateImageCommand(params)
  return sendCommand(command)
}
