'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function cleanConfigurations() {
    const {clusters, users, contexts} = await bash('kubectl config view -o json', true);


    return {clusters, users, contexts};
    // const {confirmation} = await inquirer.prompt({type: 'confirm', name: 'confirmation', message: 'Are you sure?'});
    // if (confirmation) {
    //     await Aigle.resolve(contexts).forEach(async function (context) {
    //         if (clusters.includes(context)) {
    //             await bash(`kubectl config delete-cluster '${context}'`, true);
    //         }
    //         await bash(`kubectl config delete-context '${context}'`, true);
    //     });
    // }
}

module.exports = cleanConfigurations;