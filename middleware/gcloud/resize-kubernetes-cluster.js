'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function resizeKubernetesCluster() {
    let {name, zone} = await require('./select-cluster')();
    let nodePool = await require('./select-cluster-node-pool')(name, zone);
    let questions = [
        {name: 'num-nodes', message: 'Type the number of nodes to be created:'}
    ];
    let answers = await inquirer.prompt(questions);
    let numNodes = answers['num-nodes'];

    try {
        await bash(`gcloud container clusters resize ${name} --zone ${zone} --node-pool ${nodePool} --num-nodes ${numNodes} --quiet --async`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }
}

module.exports = resizeKubernetesCluster;