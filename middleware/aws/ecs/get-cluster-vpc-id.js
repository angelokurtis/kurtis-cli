'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function getClusterVpcId(clusterName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const instances = await require('./get-cluster-instances')(clusterName);
    return await Aigle.flatMap(instances, instance => instance.attributes)
        .filter(attr => attr.name === 'ecs.vpc-id')
        .map(subnet => subnet.value)
        .uniq()
        .first();
}

module.exports = getClusterVpcId;