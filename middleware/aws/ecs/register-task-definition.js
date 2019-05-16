'use strict';

const bash = require('../../bash');
const readFile = require('util').promisify(require('fs').readFile);

async function registerTaskDefinition(taskDefinitionFilePath) {
    if (!taskDefinitionFilePath) throw new Error('task definition file path should not be null');

    const taskDefinition = JSON.parse(await readFile(taskDefinitionFilePath));

    return await bash(`aws ecs register-task-definition --family ${taskDefinition.family} --cli-input-json '${JSON.stringify(taskDefinition)}'`, true);
}

module.exports = registerTaskDefinition;