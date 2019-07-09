'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const Table = require('cli-table');

async function status(args, {balancerName, targetName}) {
    try {
        const balancer = await (balancerName ?
            require('../../../../middleware/aws/load-balancers/describe-balancer')(balancerName) :
            require('../../../../middleware/aws/load-balancers/select-balancer')());
        const targets = await require('../../../../middleware/aws/load-balancers/list-target-groups')(balancer, targetName);
        const health = await require('../../../../middleware/aws/load-balancers/health')(targets);

        const table = new Table({
            head: ['TARGET', 'ADDRESS', 'STATUS'],
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

        for (let i = 0; i < health.length; i++) {
            const {target, address, status} = health[i];
            table.push([target, address, status])
        }

        handle.success(table.toString());
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
