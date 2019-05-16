'use strict';

const bash = require('../../bash');

function taskDefinitionRevisions(family) {
    if (!family) throw new Error('task definition family should not be null');

    return bash(`aws ecs list-task-definitions --family-prefix ${family} --query 'taskDefinitionArns'`);
}

module.exports = taskDefinitionRevisions;