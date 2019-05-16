'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');

async function list(args, options) {
    try {
        const deployments = await require('../../../../../middleware/aws/codedeploy/list-deployments')();
        handle.success(deployments);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
