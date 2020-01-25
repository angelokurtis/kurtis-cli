'use strict';

const inquirer = require('inquirer');
const Aigle = require('aigle');

async function selectDeploys() {
    let deploys = await require('./list-deploys')();
    const choices = await Aigle.resolve(deploys).map(deploy => ({
        name: `${deploy.namespace}/${deploy.name}`,
        value: deploy
    }));
    let questions = [{
        pageSize: 20,
        type: 'checkbox',
        name: 'deploys',
        message: 'Choose the Kubernetes deployments:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['deploys'];
}

module.exports = selectDeploys;