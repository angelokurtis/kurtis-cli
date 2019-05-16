'use strict';

const ROOT_PATH = '../../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');

async function clean(args, {repository}) {
    try {
        if (!repository) {
            const repositories = await require(`${ROOT_PATH}/middleware/aws/ecr/repositories`)();
            let questions1 = [{
                type: 'list',
                name: 'repository',
                message: 'Choose the Repository:',
                choices: repositories
            }];
            const answers1 = await inquirer.prompt(questions1);
            repository = answers1['repository'];
        }
        const images = await require(`${ROOT_PATH}/middleware/aws/ecr/images`)(repository);
        handle.success(images);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--repository <repository>', 'The repository name', cli.STRING)
        .action(clean);
};
