'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function getClusterSubnets(clusterName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const instances = await require('./get-cluster-instances')(clusterName);
    const attributes = await Aigle.flatMap(instances, instance => instance.attributes);
    const subnets = await Aigle.filter(attributes, attr => attr.name === 'ecs.subnet-id');

    return await Aigle.map(subnets, subnet => subnet.value);
}

module.exports = getClusterSubnets;