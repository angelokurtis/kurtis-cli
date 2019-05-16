'use strict';

const fs = require('fs');
const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

const {clusters} = JSON.parse(fs.readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function listServices(environmentName) {
    if (!environmentName) throw new Error('environment name should not be null');

    const index = await Aigle.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    const {serviceArns} = await bash(`aws ecs list-services --cluster ${clusterName}`);
    return await Aigle
        .map(serviceArns, service => service.split('/')[1])
        .reduce(function (result, key) {
            result = result + `\n${key}`;
            return result
        })
}

module.exports = listServices;