// Imports
const {
  EC2Client, // sle note: the REST client to talk with AWS EC2 service. (Does a lot of complex encription of commands for sending over the wire)
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand
} = require('@aws-sdk/client-ec2')
const helpers = require('./helpers')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

// Declare local variables
const sgName = 'hamster_sg2'
const keyName = 'hamster_key2'

// Do all the things together
async function execute () {
  try {
    await createSecurityGroup(sgName)
    const keyPair = await createKeyPair(keyName)
    await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

// Create functions
async function createSecurityGroup (sgName) {
  const sgParams = {
    Description: sgName,
    GroupName: sgName
  }
  // sle note: 'CreateSecurityGroupCommand' is the API class, which
  // will be passed to the EC2Client via the SendCommand. This function is 
  // all about configuring its parameters.
  const createCommand = new CreateSecurityGroupCommand(sgParams)
  const data = await sendCommand(createCommand)

  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [ // sle note: So users can SSH into the EC2 instance
      {
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      },
      {
        IpProtocol: 'tcp', // Sle note: Tobe used by the installed Website.
        FromPort: 3000,
        ToPort: 3000,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      }
    ]
  }
  const authCommand = new AuthorizeSecurityGroupIngressCommand(rulesParams)
  return sendCommand(authCommand)
}

async function createKeyPair (keyName) {
  const params = {
    KeyName: keyName
  }
  const command = new CreateKeyPairCommand(params)
  return sendCommand(command)
}

// sle note: The nodejs website is cloned from github and run using the UserData!!
async function createInstance (sgName, keyName) {
  const params = {
    ImageId: 'ami-043f3160d6e9b6dcd', // Sle note: find this value by a trick, where you partially create an EC2 in the Amazon UI and copy the value.
    InstanceType: 't2.micro',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [ sgName ],
    // sle note: contains the hashed  cli commands to load the website from Github and set it running.
    UserData: 'IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbApjZCAvaG9tZS9iaXRuYW1pL2hiZmwKc3VkbyBucG0gaQpzdWRvIG5wbSBydW4gc3RhcnQ='
  }
  // sle note: 'RunInstancesCommand' is the API class imported form the SDK, and does the work
  const command = new RunInstancesCommand(params) // sle note 'a constructor call'
  return sendCommand(command)
}

execute()

// Sle note: NOTES ON EXECUTION USING NODE
//
// 1. Check in AWS management console that the Subnets auto create public IP addresses
// 2. In CMD, cd, or navigate to the demo project
// 3. Run: npm install
// 4. cd scripts/03
// 5. Run: node create-ec2-instance.js
// 6. note that 'key written to  /users/fallbarn/.ssh/hamster_key
// 7. note that a refresh in the dashboard shows the new instance.
// 8. noted that copying the public ip address, ex: 3.16.177.43:3000 opens the Hamster website.


