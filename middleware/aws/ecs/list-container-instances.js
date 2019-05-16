'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function listContainerInstances(environmentName) {
    if (!environmentName) throw new Error('environment name should not be null');

    const index = await Aigle.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    const {containerInstanceArns} = await bash(`aws ecs list-container-instances --cluster ${clusterName}`);
    return containerInstanceArns;
}

module.exports = listContainerInstances;