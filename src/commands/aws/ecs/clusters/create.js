'use strict';

const ROOT_PATH = '../../../../..';

const Aigle = require('aigle');
const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');
const sh = require(`${ROOT_PATH}/middleware/bash`);

async function create(args, {clusterName}) {
    try {
        const bla = await sh('ecs-cli images');
        handle.success(bla);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--cluster-name <cluster-name>', 'The Amazon ECS cluster name to use', cli.STRING)
        .action(create);
};
