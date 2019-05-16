'use strict';

const sh = require('../../bash');
const Aigle = require('aigle');

async function listDeployments() {
    const {deployments} = await sh('aws deploy list-deployments');

    return await Aigle.resolve(deployments).map(require('./get-deployment'));
}

module.exports = listDeployments;