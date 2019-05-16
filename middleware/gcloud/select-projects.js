'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectProjects() {
    let projects = await require('./list-projects')();
    let choices = await Aigle.resolve(projects).map(project => ({name: project['name'], value: project}));
    let questions = [{
        type: 'checkbox',
        name: 'projects',
        message: 'Choose the GCloud Projects:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['projects'];
}

module.exports = selectProjects;