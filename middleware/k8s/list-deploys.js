'use strict';

const bash = require('../bash');
const Aigle = require('aigle');

async function listDeploys() {
    const {items} = await bash('kubectl get deployments --all-namespaces -o json', true);
    return Aigle
        .resolve(items)
        .map(({metadata, spec}) => {
            const {name, namespace} = metadata;
            const {replicas} = spec;
            return {name, namespace, replicas}
        });
}

module.exports = listDeploys;