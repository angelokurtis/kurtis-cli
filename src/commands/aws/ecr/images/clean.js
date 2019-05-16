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
        const danglingImages = await require(`${ROOT_PATH}/middleware/aws/ecr/clean-old-images`)(repository);
        handle.success(danglingImages);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Clean Docker images by removing all dangling images')
        .option('--repository <repository>', 'The repository name', cli.STRING)
        .action(clean);
};
