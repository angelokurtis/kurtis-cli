'use strict';

const bash = require('../../bash');

async function getLatestTaskDefinition(family) {
    if (!family) throw new Error('task definition family should not be null');

    const {taskDefinition} = await bash(`aws ecs describe-task-definition --task-definition ${family}`);
    return taskDefinition;
}

module.exports = getLatestTaskDefinition;