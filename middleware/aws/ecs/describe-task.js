'use strict';

const bash = require('../../bash');

async function describeTask(clusterName, taskArn) {
    if (!clusterName) throw new Error('cluster name should not be null');
    if (!taskArn) throw new Error('task arn should not be null');

    const {tasks} = await bash(`aws ecs describe-tasks --cluster ${clusterName} --tasks ${taskArn}`);
    return tasks[0];
}

module.exports = describeTask;