'use strict';

const bash = require('../../bash');

async function describeBalancer(balancerName) {
    if (!balancerName) throw new Error('load balancer name should not be null');

    const {LoadBalancers: balancers} = await bash(`aws elbv2 describe-load-balancers --name ${balancerName}`);
    return balancers.length > 0 ? balancers[0] : null;
}

module.exports = describeBalancer;