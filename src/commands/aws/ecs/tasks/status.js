'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const Aigle = require('aigle');
const moment = require('moment-timezone');
const Table = require('cli-table');

async function status(args, {clusterName, serviceName}) {
    try {
        clusterName = clusterName || await require('../../../../../middleware/aws/ecs/select-cluster')();
        const tasks = await Aigle.resolve(await require('../../../../../middleware/aws/ecs/tasks-by-cluster')(clusterName, serviceName))
            .map(function ({taskArn, taskDefinitionArn, group, lastStatus, startedAt, containers}) {
                const address = containers[0]['networkInterfaces'][0]['privateIpv4Address'];
                const task = taskArn.split('/')[1];
                const taskDefinition = taskDefinitionArn.split('/')[1];
                const service = group.replace('service:', '');
                const time = moment(startedAt * 1000).tz('America/Sao_Paulo');
                return {
                    service: service,
                    task: task,
                    task_definition: taskDefinition,
                    status: lastStatus,
                    address: address,
                    up_time: time.fromNow()
                }
            });

        const table = new Table({
            head: ['SERVICE', 'TASK', 'TASK_DEFINITION', 'STATUS', 'ADDRESS', 'UP_TIME'],
            chars: {
                'top': '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                'bottom': '',
                'bottom-mid': '',
                'bottom-left': '',
                'bottom-right': '',
                'left': '',
                'left-mid': '',
                'mid': '',
                'mid-mid': '',
                'right': '',
                'right-mid': '',
                'middle': ''
            }
        });
        for (let i = 0; i < tasks.length; i++) {
            const {service, task, task_definition, status, address, up_time} = tasks[i];
            table.push([service, task, task_definition, status, address, up_time])
        }
        handle.success(table.toString());
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
