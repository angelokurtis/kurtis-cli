'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function resizeKubernetesCluster() {
    let clusters = await require('./list-kubernetes-cluster')();
    let choices = await Aigle.resolve(clusters).map(cluster => ({name: cluster['name'], value: cluster}));
    let questions = [
        {type: 'list', name: 'cluster', message: 'Choose the GCloud Kubernetes Cluster:', choices},
        {name: 'num-nodes', message: 'Type the number of nodes to be created:'}
    ];
    let answers = await inquirer.prompt(questions);
    let cluster = answers['cluster'];
    let numNodes = answers['num-nodes'];

    try {
        await bash(`gcloud container clusters resize ${cluster['name']} --node-pool default-pool --size ${numNodes} --quiet --async`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }
}

module.exports = resizeKubernetesCluster;