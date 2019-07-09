'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectLoadBalancer() {
    const balancers = await require('./list-balancers')();
    const length = balancers.length;
    if (length < 1) {
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
    } else if (length === 1) {
        return balancers[0]
    } else return null;
}

module.exports = selectLoadBalancer;