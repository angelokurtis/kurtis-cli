'use strict';

const bash = require('../bash');
const Aigle = require('aigle');

async function listAllKubernetesCluster() {
    const projects = await require('./list-projects')();
    return Aigle.resolve(projects).flatMap(listKubernetesCluster)
}

async function listKubernetesCluster(project) {
    let clusters = await bash(`gcloud container clusters list --project ${project.projectId} --format json`);
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
            cluster['project'] = project;
            return cluster;
        })
}

module.exports = listAllKubernetesCluster;