'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectLogGroups() {
    const logGroups = await require('./list-log-groups')();
    const choices = await Aigle.resolve(logGroups).map(logGroup => ({
        name: logGroup['logGroupName'],
        value: logGroup
    }));
    const questions = [{
        type: 'checkbox',
        name: 'logGroups',
        message: 'Choose the Log Group:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['logGroups'];
}

module.exports = selectLogGroups;