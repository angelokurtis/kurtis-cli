'use strict';

const bash = require('../bash');
const Aigle = require('aigle');

async function listKubernetesCluster() {
    let clusters = await bash('gcloud container clusters list --format json', true);
    return await Aigle.resolve(clusters)
        .map(({name, status, zone, createTime, currentNodeCount, nodePools}) => ({
            name,
            status,
            zone,
            createTime,
            currentNodeCount,
            nodePools
        }))
        .map(async function (cluster) {
            cluster['nodePools'] = await Aigle.resolve(cluster['nodePools']).map(({name, initialNodeCount}) => ({
                name,
                initialNodeCount
            }));
            return cluster;
        })
}

module.exports = listKubernetesCluster;