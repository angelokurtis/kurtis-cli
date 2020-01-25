'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectClusterNodePool(cluster, zone) {
    if (!cluster) throw new Error('Cluster should not be null');
    if (!zone) throw new Error('Zone should not be null');

    const nodePools = await require('./list-cluster-node-pool')(cluster, zone);
    const length = nodePools.length;
    if (length > 1) {
        const questions = [{
            type: 'list',
            name: 'node-pool',
            message: 'Choose the cluster node pool:',
            choices: nodePools
        }];
        const answers = await inquirer.prompt(questions);
        return answers['node-pool'];
    } else if (length === 1) {
        return nodePools[0]
    } else return null;
}

module.exports = selectClusterNodePool;