'use strict';

const bash = require('../../bash');

async function listBalancers() {
    const {LoadBalancers: balancers} = await bash(`aws elbv2 describe-load-balancers`);
    return balancers;
}

module.exports = listBalancers;