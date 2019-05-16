'use strict';

const cli = require('caporal');
const AppContext = require('../../../../../context/index');
const handle = require('../../../../../middleware/output-handler/index');
const inquirer = require('inquirer');

async function list(args, options) {
    try {
        const profiles = AppContext.profiles();
        let output = await profiles.all();
        handle.success(output);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List all AWS profiles')
        .action(list);
};
