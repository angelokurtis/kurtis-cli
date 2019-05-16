'use strict';

const bash = require('../../bash');
const util = require('util');
const _ = require('lodash');
const readFile = util.promisify(require('fs').readFile);

const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function createService(serviceName, environmentName) {
    if (!serviceName) throw new Error('service name should not be null');
    if (!environmentName) throw new Error('environment name should not be null');

    const family = `${environmentName}-${serviceName}`;
    const index = _.findIndex(clusters, cluster => cluster.environment === environmentName);
    const clusterName = clusters[index].cluster;

    const taskDefinition = await require('./get-latest-task-definition')(family);
    const targetGroup = await require('../load-balancers/get-target-group')(environmentName, serviceName);

    const inputJson = await generateSkeleton(clusterName, serviceName, taskDefinition, targetGroup);
    return await bash(`aws ecs create-service --cli-input-json '${JSON.stringify(inputJson)}'`, true);
}

async function generateSkeleton(clusterName, serviceName, taskDefinition, {TargetGroupArn}) {
    if (!clusterName) throw new Error('cluster name should not be null');
    if (!serviceName) throw new Error('service name should not be null');
    if (!taskDefinition) throw new Error('cluster name should not be null');
    if (!TargetGroupArn) throw new Error('target group arn should not be null');

    const skeleton = JSON.parse(await readFile(`${__dirname}/create-service-skeleton.json`, 'utf8'));
    skeleton.cluster = clusterName;
    skeleton.serviceName = serviceName;
    skeleton.taskDefinition = taskDefinition.taskDefinitionArn;

    skeleton.loadBalancers.push({
        containerName: `${serviceName}-app`,
        targetGroupArn: TargetGroupArn,
        containerPort: taskDefinition.containerDefinitions[0].portMappings[0].containerPort
    });

    return skeleton;
}

module.exports = createService;