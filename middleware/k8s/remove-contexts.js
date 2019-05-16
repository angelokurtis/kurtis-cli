'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');


async function removeContexts() {
    const contexts = await require('./select-contexts')();

    const {confirmation} = await inquirer.prompt({type: 'confirm', name: 'confirmation', message: 'Are you sure?'});

    if (confirmation) {
        const clusters = await require('./list-clusters')();
        await Aigle.resolve(contexts).forEach(async function (context) {
            if (clusters.includes(context)) {
                await bash(`kubectl config delete-cluster '${context}'`, true);
            }
            await bash(`kubectl config delete-context '${context}'`, true);
        });
    }
}

module.exports = removeContexts;