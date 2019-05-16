'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function getClusterInstances(clusterName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const {containerInstanceArns} = await bash(`aws ecs list-container-instances --cluster ${clusterName}`);
    return await Aigle.flatMap(containerInstanceArns, async containerInstanceArn => getClusterInstance(clusterName, containerInstanceArn));
}

async function getClusterInstance(clusterName, containerInstanceArn) {
    if (!clusterName) throw new Error('cluster name should not be null');
    if (!containerInstanceArn) throw new Error('container instance arn should not be null');

    const {containerInstances} = await bash(`aws ecs describe-container-instances --cluster ${clusterName} --container-instances ${containerInstanceArn}`);
    return containerInstances;

}

module.exports = getClusterInstances;