// Imports
const {
  CreateLaunchTemplateCommand
} = require('@aws-sdk/client-ec2')

const helpers = require('./helpers')

const ltName = 'hamsterLT'
const roleName = 'hamsterLTRole'
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

async function execute () {
  try {
    const profileArn = await helpers.createIamRole(roleName)
    const response = await createLaunchTemplate(ltName, profileArn)
    console.log('Created launch template with:', response)
  } catch (err) {
    console.error('Failed to create launch template with:', err)
  }
}

// sle note: Similar to Create-ec2-instance.js, but doesn't
// create the instance, instead a template that can be versioned.
// It is designed to be created automatically by the auto scaling mechanism.
async function createLaunchTemplate (ltName, profileArn) {
  const params = {
    LaunchTemplateName: ltName,
    LaunchTemplateData: {
      IamInstanceProfile: {
        Arn:profileArn
      }
    },
    ImageId: 'ami-043f3160d6e9b6dcd',
    InstanceType: 't2.micro',
    KeyName: keyName,
    SecurityGroups: [ sgName ],
    UserData: 'IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbApjZCAvaG9tZS9iaXRuYW1pL2hiZmwKc3VkbyBucG0gaQpzdWRvIG5wbSBydW4gc3RhcnQ='
  }
  const command = new CreateLaunchTemplateCommand(params)
  return helpers.sendCommand(command)
}

execute()