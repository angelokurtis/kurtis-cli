'use strict';

const sh = require('../../bash');

async function getDeployment(deploymentId) {
    if (!deploymentId) throw new Error('deployment id should not be null');

    const {deploymentInfo} = await sh(`aws deploy get-deployment --deployment-id ${deploymentId}`);
    return deploymentInfo;
}

module.exports = getDeployment;