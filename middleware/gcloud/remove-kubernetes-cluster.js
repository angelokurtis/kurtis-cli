'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function removeKubernetesCluster(clusterName) {
    if (!clusterName) {
        let clusters = await require('./list-kubernetes-cluster')();
        let choices = await Aigle.resolve(clusters).map(cluster => ({name: cluster['name'], value: cluster}));
        let questions = [
            {type: 'list', name: 'cluster', message: 'Choose the GCloud Kubernetes Cluster:', choices},
        ];
        let answers = await inquirer.prompt(questions);
        clusterName = answers['cluster']['name'];
    }
    await bash(`gcloud container clusters delete ${clusterName} --async --quiet`, true);
}

module.exports = removeKubernetesCluster;