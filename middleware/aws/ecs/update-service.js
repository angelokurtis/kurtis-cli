'use strict';

const bash = require('../../bash');
const _ = require('lodash');

const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function updateService(serviceName, environmentName, {force, dryRun}) {
    if (!serviceName) throw new Error('service name should not be null');
    if (!environmentName) throw new Error('environment name should not be null');

    const family = `${environmentName}-${serviceName}`;
    const index = _.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    const {taskDefinitionArn} = await require('./get-latest-task-definition')(family);

    if (force) {
        const {taskArns} = await bash(`aws ecs list-tasks --cluster ${clusterName} --service-name ${serviceName}`);
        taskArns.forEach(async taskArn => await bash(`aws ecs stop-task --cluster ${clusterName} --task ${taskArn}`, true, dryRun));
    }
    const {service} = await bash(`aws ecs update-service --cluster ${clusterName} --force-new-deployment --service ${serviceName} --task-definition ${taskDefinitionArn}`, true, dryRun);
    delete service['events'];
    return service;
}

module.exports = updateService;