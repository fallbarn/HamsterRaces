// Imports
const {
  CreateAutoScalingGroupCommand,
  PutScalingPolicyCommand
} = require('@aws-sdk/client-auto-scaling')

const { sendAutoScalingCommand } = require('./helpers')

// Declare local variables
const asgName = 'hamsterASG' // ASG AutoScalingGroup
const ltName = 'hamsterLT'
const policyName = 'hamsterPolicy'
const tgArn = '/* TODO: get target group ARN */'

async function execute () {
  try {
    const response = await createAutoScalingGroup(asgName, ltName)
    await createASGPolicy(asgName, policyName)
    console.log('Created auto scaling group with:', response)
  } catch (err) {
    console.error('Failed to create auto scaling group with:', err)
  }
}


function createAutoScalingGroup (asgName, ltName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: [
      'us-east-2a',
      'us-east-2b'
    ],
    LaunchTemplate: {
      LaunchTemplateName: ltName
    },
    MaxSize:2,
    MinSize:1,
    TargetGroupARNs: [tgArn]
  }

  const command =  new CreateAutoScalingGroupCommand(params);
  return sendAutoScalingCommand(command);
}

function createASGPolicy (asgName, policyName) {
  const params = {
    AdjustmentType: 'ChangeInCapacity',
    AutoScalingGroupName: asgName,
    policyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: 
    {
      TargetValue: 5,
        PredefinedMetricSpecification: {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      }
      }
  }

  const command =  new PutScalingPolicyCommand(params);
  return sendAutoScalingCommand(command);
}

execute()