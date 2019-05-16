'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const inquirer = require('inquirer');

async function create(args, options) {
    try {
        const role = await require('../../../../../middleware/aws/codedeploy/create-role')();
        handle.success(role);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(create);
};
