'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const Aigle = require('aigle');
const moment = require('moment-timezone');

async function status(args, {clusterName, serviceName}) {
    try {
        const tasks = await Aigle.resolve(await require('../../../../../middleware/aws/ecs/tasks-by-cluster')(clusterName, serviceName))
            .map(function ({taskArn, taskDefinitionArn, group, lastStatus, startedAt}) {
                const task = taskArn.split('/')[1];
                const taskDefinition = taskDefinitionArn.split('/')[1];
                const service = group.replace('service:', '');
                const time = moment(startedAt * 1000).tz('America/Sao_Paulo');
                return {
                    service: service,
                    task: task,
                    task_definition: taskDefinition,
                    status: lastStatus,
                    up_time: time.fromNow()
                }
            });
        handle.success(tasks);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--cluster-name <cluster-name>', 'The ECS Cluster name', cli.STRING)
        .option('--service-name <service-name>', 'The ECS Service name', cli.STRING)
        .action(status);
};
