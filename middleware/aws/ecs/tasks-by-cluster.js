'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const bash = require('../../bash');

async function tasksByCluster(clusterName, serviceName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const {taskArns} = serviceName ?
        await bash(`aws ecs list-tasks --cluster ${clusterName} --service-name ${serviceName}`) :
        await bash(`aws ecs list-tasks --cluster ${clusterName}`);
    return await Aigle.map(taskArns, arn => require('./describe-task')(clusterName, arn));
}

module.exports = tasksByCluster;