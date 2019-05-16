'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function health(targets) {
    if (!targets) throw new Error('The target groups should not be null');

    return await Aigle
        .map(targets, target => {
            const result = {targetGroupName: target['TargetGroupName']};
            result['healthCheckPath'] = target['HealthCheckPath'];
            result['protocol'] = target['Protocol'].toLowerCase();
            result['targetGroupArn'] = target['TargetGroupArn'];
            return result
        })
        .flatMap(describeTargetHealth)
        .map(async health => ({
            target: health['targetGroupName'],
            address: `${health.protocol}://${health.Target.Id}:${health['HealthCheckPort']}${health['healthCheckPath']}`,
            status: health['TargetHealth']['State']
        }));
}

async function describeTargetHealth({targetGroupName, protocol, targetGroupArn, healthCheckPath}) {
    const {TargetHealthDescriptions} = await bash(`aws elbv2 describe-target-health --target-group-arn ${targetGroupArn}`);
    TargetHealthDescriptions.forEach(target => {
        target.targetGroupName = targetGroupName;
        target.healthCheckPath = healthCheckPath;
        target.protocol = protocol;
    });
    return TargetHealthDescriptions;
}

module.exports = health;