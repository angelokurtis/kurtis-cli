'use strict';

const bash = require('../../bash');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);
const _ = require('lodash');

async function generateTaskDefinition(serviceName, environmentName) {
    if (!serviceName) throw new Error('service name should not be null');
    if (!environmentName) throw new Error('environment name should not be null');

    const family = `${environmentName}-${serviceName}`;
    const {taskDefinition} = await bash(`aws ecs describe-task-definition --task-definition ${family}`, true);

    delete taskDefinition['taskDefinitionArn'];
    delete taskDefinition['revision'];
    delete taskDefinition['status'];
    delete taskDefinition['requiresAttributes'];
    delete taskDefinition['compatibilities'];

    taskDefinition.family = family;
    taskDefinition.containerDefinitions.forEach(container => setEnv(container, serviceName, environmentName));

    const filepath = `${path.resolve('./')}/${family}-task-definition.json`;
    writeFile(filepath, JSON.stringify(taskDefinition, null, 2));
    return filepath;
}

function setEnv(container, serviceName, environmentName) {
    const streamPrefix = environmentName === 'production' ? 'ecs' : `ecs-${environmentName}`;
    container.logConfiguration = {
        logDriver: 'awslogs',
        options: {
            'awslogs-group': `/${streamPrefix}/${serviceName}`,
            'awslogs-region': 'sa-east-1',
            'awslogs-stream-prefix': streamPrefix
        }
    };
    const index = _.findIndex(container.environment, env => env.name === 'SPRING_PROFILES_ACTIVE');
    if (index > -1) {
        container.environment[index].value = environmentName === 'production' ? 'prod' : environmentName;
    }
}

module.exports = generateTaskDefinition;