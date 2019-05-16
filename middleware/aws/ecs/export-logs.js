'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function exportLogs(serviceName, environment) {
    if (!serviceName) throw new Error('service name should not be null');
    if (!environment) throw new Error('environment should not be null');

    const containerInstanceArns = await require('./list-container-instances')(environment);

    const index = await Aigle.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    await Aigle
        .map(containerInstanceArns, arn => getContainerInstance(arn, clusterName))
        .map(getInstance)
        .map(instance => instance.PublicIpAddress)
        .map(instance => instance.PublicIpAddress);
    return tasks[0];
}

async function getContainerInstance(containerInstanceArn, clusterName) {
    const {containerInstances} = await bash(`aws ecs describe-container-instances --container-instances ${containerInstanceArn} --cluster ${clusterName}`);
    return containerInstances[0];
}

async function getInstance({ec2InstanceId}) {
    const {Reservations} = await bash(`aws ec2 describe-instances --instance-ids ${ec2InstanceId}`);
    return Reservations[0]['Instances'][0];
}

async function getLogs({PublicIpAddress, KeyName}) {
    const {Reservations} = await bash(`aws ec2 describe-instances --instance-ids ${ec2InstanceId}`);
    return Reservations[0]['Instances'][0];
}

module.exports = exportLogs;