'use strict';

const cli = require('caporal');
const handle = require('../../../middleware/output-handler');
const inquirer = require('inquirer');

async function snapshot(args, {all}) {
    try {
        let services = [
            'instances',
            // 'images',
            'volumes',
            'vpcs',
            'subnets',
            'security-groups',
            'network-interfaces',
            'load-balancers',
            'target-groups',
            'auto-scaling-groups',
            'policies',
            'roles'
        ];
        if (!all) {
            let questions = [{
                type: 'checkbox',
                name: 'services',
                message: 'Choose the AWS Services to take a snapshot:',
                choices: services
            }];
            const answers = await inquirer.prompt(questions);
            services = answers['services'];
        }
        await require('../../../middleware/aws/generic/environment-snapshot')(services);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Take a snapshot from the AWS environment')
        .option('--all', 'The Load Balancer name')
        .action(snapshot);
};
