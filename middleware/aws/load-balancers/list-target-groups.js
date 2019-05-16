'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function listTargetGroups(balancer, targetName) {
    if (!balancer) throw new Error('load balancer should not be null');

    const {TargetGroups: targets} = await bash(`aws elbv2 describe-target-groups --load-balancer-arn ${balancer['LoadBalancerArn']}`);
    return targetName ?
        await Aigle.resolve(targets).filter(({TargetGroupName}) => TargetGroupName === targetName) :
        targets;
}

module.exports = listTargetGroups;