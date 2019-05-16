'use strict';

const inquirer = require('inquirer');

async function selectContexts() {
    let contexts = await require('./list-contexts')();
    let questions = [{
        type: 'checkbox',
        name: 'contexts',
        message: 'Choose the Kubernetes contexts:',
        choices: contexts
    }];
    const answers = await inquirer.prompt(questions);
    return answers['contexts'];
}

module.exports = selectContexts;