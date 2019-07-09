'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectCluster() {
    const clusters = await require('./list-clusters')();
    const length = clusters.length;
    if (length < 1) {
        const questions = [{
            type: 'list',
            name: 'cluster',
            message: 'Choose the ECS Cluster:',
            choices: clusters
        }];
        const answers = await inquirer.prompt(questions);
        return answers['cluster'];
    } else if (length === 1) {
        return clusters[0]
    } else return null;
}

module.exports = selectCluster;