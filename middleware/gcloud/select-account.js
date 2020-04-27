'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectAccount() {
    let accounts = await require('./list-accounts')();
    const length = accounts.length;
    if (length > 1) {
        let questions = [{
            type: 'list',
            name: 'account',
            message: 'Choose the GCloud Account:',
            choices: accounts
        }];
        const answers = await inquirer.prompt(questions);
        return answers['account'];
    } else if (length === 1) {
        return accounts[0]
    } else return null;
}

module.exports = selectAccount;