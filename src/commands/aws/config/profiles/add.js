'use strict';

const cli = require('caporal');
const AppContext = require('../../../../../context/index');
const handle = require('../../../../../middleware/output-handler/index');
const inquirer = require('inquirer');

async function list(args, {name}) {
    try {
        if (!name) {
            let questions = [{
                type: 'input',
                name: 'name',
                message: 'Type the new AWS Profile name:'
            }];
            const answers = await inquirer.prompt(questions);
            name = answers.name;
        }
        const profiles = AppContext.profiles();
        profiles.add(name)
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List all AWS profiles')
        .option('--name <profile-name>', 'The AWS Profile name', cli.STRING)
        .action(list);
};
