'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectAccount() {
    let accounts = await require('./list-accounts')();
    let questions = [{
        type: 'list',
        name: 'account',
        message: 'Choose the GCloud Account:',
        choices: accounts
    }];
    const answers = await inquirer.prompt(questions);
    return answers['account'];
}

module.exports = selectAccount;