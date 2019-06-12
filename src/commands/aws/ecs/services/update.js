'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const Aigle = require('aigle');
const moment = require('moment-timezone');
const bash = require('../../../../../middleware/bash');

async function update(args, {clusterName}) {
    try {
        const services = await require('../../../../../middleware/aws/ecs/select-services-by-cluster')(clusterName);
        await Aigle.resolve(services)
            .forEach(service => bash(`aws ecs update-service --service ${service} --force-new-deployment --cluster ${clusterName}`, true));
        handle.success(services);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--cluster-name <cluster-name>', 'The ECS Cluster name', cli.STRING)
        .action(update);
};
