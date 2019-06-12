'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const Aigle = require('aigle');
const moment = require('moment-timezone');
const bash = require('../../../../../middleware/bash');

async function stop(args, {clusterName, serviceName}) {
    try {
        const tasks = await require('../../../../../middleware/aws/ecs/select-tasks-by-cluster')(clusterName, serviceName);
        await Aigle.resolve(tasks)
            .forEach(({taskArn}) => bash(`aws ecs stop-task --cluster ${clusterName} --task ${taskArn}`), true);
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
        .action(stop);
};
