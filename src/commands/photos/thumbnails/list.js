'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function list() {
    try {
        const thumbnails = await require(`${ROOT_PATH}/middleware/photos/list-all-thumbnails`)();
        handle.success(thumbnails);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
