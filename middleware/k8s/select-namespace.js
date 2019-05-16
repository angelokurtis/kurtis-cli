'use strict';

const inquirer = require('inquirer');

async function selectNamespace() {
    let namespaces = await require('./list-namespaces')();
    let questions = [{
        type: 'list',
        name: 'namespace',
        message: 'Choose the preferred Kubernetes namespace:',
        choices: namespaces
    }];
    const answers = await inquirer.prompt(questions);
    return answers['namespace'];
}

module.exports = selectNamespace;