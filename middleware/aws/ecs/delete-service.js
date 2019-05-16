'use strict';

const bash = require('../../bash');
const _ = require('lodash');

const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function deleteService(serviceName, environmentName) {
    if (!serviceName) throw new Error('service name should not be null');
    if (!environmentName) throw new Error('environment name should not be null');

    const index = _.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    await bash(`aws ecs update-service --cluster '${clusterName}' --service '${serviceName}' --desired-count 0`, true);
    const {taskArns} = await bash(`aws ecs list-tasks --cluster ${clusterName} --service-name ${serviceName}`);
    taskArns.forEach(async taskArn => await bash(`aws ecs stop-task --cluster ${clusterName} --task ${taskArn}`));
    return await bash(`aws ecs delete-service --cluster '${clusterName}' --service '${serviceName}'`, true);
}

module.exports = deleteService;