'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const inquirer = require('inquirer');

async function createPublic(args, options) {
    try {
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(createPublic);
};
