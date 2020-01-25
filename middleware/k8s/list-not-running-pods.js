'use strict';

const Aigle = require('aigle');
const bash = require('../bash');

async function listNotRunningPods() {
    const {items: pods} = await bash('kubectl get pods --field-selector=status.phase!=Running --all-namespaces -o json', true);
    return Aigle.resolve(pods)
        .map(({metadata, status}) => {
            const {name, namespace} = metadata;
            const {phase} = status;
            return {name, namespace, status: phase}
        });
}

module.exports = listNotRunningPods;