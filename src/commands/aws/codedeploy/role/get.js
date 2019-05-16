'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');

async function get(args, options) {
    try {
        const roles = await require('../../../../../middleware/aws/iam/list-roles-by-service')('codedeploy.amazonaws.com');
        handle.success(roles);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(get);
};
