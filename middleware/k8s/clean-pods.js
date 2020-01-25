'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function cleanPods() {
    const pods = await require('./list-not-running-pods')();
    if (pods.length > 0) {
        const choices = await Aigle.resolve(pods).map(pod => ({
            name: `${pod.namespace}\t${pod.name}\t[${pod.status}]`,
            value: pod
        }));
        const questions = [{
            type: 'checkbox',
            name: 'pods',
            message: 'Choose the pod that will be deleted:',
            choices
        }];
        const answers = await inquirer.prompt(questions);
        const answer = answers['pods'];

        const {confirmation} = await inquirer.prompt({type: 'confirm', name: 'confirmation', message: 'Are you sure?'});
        if (confirmation) await Aigle.resolve(answer).forEach(async function ({name, namespace}) {
            await bash(`kubectl delete pod ${name} -n ${namespace}`, true);
        });
    } else {
        console.log("All pods are running")
    }
}

module.exports = cleanPods;