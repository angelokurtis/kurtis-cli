'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function listClusters() {
    const {clusterArns} = await bash('aws ecs list-clusters',true);
    return Aigle.uniq(clusterArns)
        .map(function (arn) {
            const arrays = arn.split('/');
            return arrays[arrays.length - 1];
        });
}

module.exports = listClusters;