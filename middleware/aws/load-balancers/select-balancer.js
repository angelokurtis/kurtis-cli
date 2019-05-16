'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectLoadBalancer() {
    const balancers = await require('./list-balancers')();
    const choices = await Aigle.resolve(balancers).map(balancer => ({
        name: balancer['LoadBalancerName'],
        value: balancer
    }));
    const questions = [{
        type: 'list',
        name: 'balancer',
        message: 'Choose the Load Balancer:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['balancer'];
}

module.exports = selectLoadBalancer;