'use strict';

const bash = require('../bash');

async function listClusters() {
    const clusters = await bash('kubectl config get-clusters');
    clusters.shift();
    return clusters;
}

module.exports = listClusters;