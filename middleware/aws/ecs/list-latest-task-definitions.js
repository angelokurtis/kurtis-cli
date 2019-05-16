'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function listLatestTaskDefinitions(environmentName) {
    const families = await require('./families')();
    return await Aigle
        .filter(families, family => family.startsWith(`${environmentName}-`))
        .map(require('./get-latest-task-definition'))
        .map(taskDefinition => taskDefinition.taskDefinitionArn);
}

module.exports = listLatestTaskDefinitions;