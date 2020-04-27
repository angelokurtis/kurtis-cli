'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectCluster() {
    const clusters = await require('./list-all-kubernetes-cluster')();
    const length = clusters.length;
    if (length > 1) {
        const choices = await Aigle.resolve(clusters).map(cluster => ({
            name: `${cluster.project.name}/${cluster.name}`,
            value: cluster
        }));
        const questions = [{
            type: 'list',
            name: 'clusters',
            message: 'Choose the Kubernetes Cluster:',
            choices
        }];
        const answers = await inquirer.prompt(questions);
        return answers['clusters'];
    } else if (length === 1) {
        return clusters[0]
    } else return null;
}

module.exports = selectCluster;