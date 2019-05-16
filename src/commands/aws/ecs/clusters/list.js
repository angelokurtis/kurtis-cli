'use strict';

const ROOT_PATH = '../../../../..';

const Aigle = require('aigle');
const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');
const sh = require(`${ROOT_PATH}/middleware/bash`);

async function list() {
    try {
        const clusters = await require(`${ROOT_PATH}/middleware/aws/ecs/list-clusters`)();
        handle.success(clusters);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
