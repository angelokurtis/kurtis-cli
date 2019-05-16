'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const inquirer = require('inquirer');

async function status(args, {balancerName, targetName}) {
    try {
        const balancer = await (balancerName ?
            require('../../../../middleware/aws/load-balancers/describe-balancer')(balancerName) :
            require('../../../../middleware/aws/load-balancers/select-balancer')());
        const targets = await require('../../../../middleware/aws/load-balancers/list-target-groups')(balancer, targetName);
        const health = await require('../../../../middleware/aws/load-balancers/health')(targets);
        handle.success(health);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--balancer-name <balancer-name>', 'The Load Balancer name', cli.STRING)
        .option('--target-name <target-name>', 'The Load Balancer name', cli.STRING)
        .action(status);
};
