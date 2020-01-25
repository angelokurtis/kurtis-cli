'use strict';

const bash = require('../bash');
const Aigle = require('aigle');

async function listClusterNodePool(cluster, zone) {
    if (!cluster) throw new Error('Cluster should not be null');
    if (!zone) throw new Error('Zone should not be null');

    let nodePools = await bash(`gcloud container node-pools list --cluster=${cluster} --zone=${zone} --format=json`);
    return await Aigle.resolve(nodePools).map(({name}) => name)
}

module.exports = listClusterNodePool;