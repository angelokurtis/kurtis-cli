'use strict';

const cli = require('caporal');
const AppContext = require('../../../../../context/index');
const handle = require('../../../../../middleware/output-handler/index');
const inquirer = require('inquirer');

async function get(args, {name}) {
    try {
        const profiles = AppContext.profiles();
        if (!name) {
            const names = await profiles.names();
            let questions = [{
                type: 'list',
                name: 'name',
                message: 'Choose the AWS Profile name:',
                choices: names
            }];
            const answers = await inquirer.prompt(questions);
            name = answers.name;
        }
        const profile = await profiles.get(name);
        handle.success(profile);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List all AWS profiles')
        .option('--name <profile-name>', 'The AWS Profile name', cli.STRING)
        .action(get);
};
