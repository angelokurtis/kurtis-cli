'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectCluster() {
    const cluster = await require('./list-kubernetes-cluster')();
    const choices = await Aigle.resolve(cluster).map(cluster => ({name: cluster.name, value: cluster}));
    const questions = [{
        type: 'list',
        name: 'cluster',
        message: 'Choose the Kubernetes Cluster:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['cluster'];
}

module.exports = selectCluster;