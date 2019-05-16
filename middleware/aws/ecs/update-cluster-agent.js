'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function updateClusterAgent(environmentName) {
    if (!environmentName) throw new Error('environment name should not be null');

    const index = await Aigle.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    const arns = await require('./list-container-instances')(environmentName);
    arns.forEach(async function (arn) {
        return await bash(`aws ecs update-container-agent --cluster '${clusterName}' --container-instance '${arn}'`, true);
    });
    return arns;
}

module.exports = updateClusterAgent;