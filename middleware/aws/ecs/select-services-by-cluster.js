'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');
const bash = require('../../bash');

async function selectServicesByCluster(clusterName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const {serviceArns} = await bash(`aws ecs list-services --cluster ${clusterName}`);
    const services = await Aigle.resolve(serviceArns);
    let questions = [{
        type: 'checkbox',
        name: 'services',
        message: 'Choose the ECS Services:',
        choices: services
    }];
    const answers = await inquirer.prompt(questions);
    return answers['services'];
}

module.exports = selectServicesByCluster;