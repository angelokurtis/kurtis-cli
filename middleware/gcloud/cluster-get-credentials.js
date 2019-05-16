'use strict';

const bash = require('../bash');

async function clusterGetCredentials() {
    let {name, zone} = await require('./select-cluster')();
    try {
        await bash(`gcloud container clusters get-credentials ${name} --zone=${zone}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('kubeconfig entry generated')) throw e;
    }
}

module.exports = clusterGetCredentials;