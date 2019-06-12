'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');
const bash = require('../../bash');
const moment = require('moment-timezone');

async function selectTasksByCluster(clusterName, serviceName) {
    if (!clusterName) throw new Error('cluster name should not be null');

    const {taskArns} = serviceName ?
        await bash(`aws ecs list-tasks --cluster ${clusterName} --service-name ${serviceName}`) :
        await bash(`aws ecs list-tasks --cluster ${clusterName}`);
    const tasks = await Aigle.map(taskArns, arn => require('./describe-task')(clusterName, arn));

    let choices = await Aigle.resolve(tasks).map(task => {
        const {taskArn, group, startedAt} = task;
        const service = group.replace('service:', '');
        const code = taskArn.split('/')[1];
        const time = moment(startedAt * 1000).tz('America/Sao_Paulo');
        return ({name: `${service} / ${code} (since ${time.fromNow()})`, value: task});
    });
    let questions = [{
        type: 'checkbox',
        name: 'tasks',
        message: 'Choose the ECS Tasks:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['tasks'];
}

module.exports = selectTasksByCluster;