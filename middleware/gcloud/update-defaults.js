'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const FG_BLUE = "\x1b[34m%s\x1b[0m";
const fs = require('fs');

async function updateDefaults() {
    // const account = await require('./select-account')();
    // try {
    //     await bash(`gcloud auth application-default login --account ${account}`, true);
    // } catch (e) {
    //     if (!e.includes || !e.includes('Your browser has been opened')) throw e;
    // }
    let {projectId: project} = await require('./select-project')();
    let {name: zone} = await require('./select-zone')();

    try {
        await bash(`gcloud config set project ${project}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }
    try {
        await bash(`gcloud config set compute/zone ${zone}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }
}

module.exports = updateDefaults;