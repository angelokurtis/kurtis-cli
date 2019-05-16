'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectProject() {
    let projects = await require('./list-projects')();
    let choices = await Aigle.resolve(projects).map(project => ({name: project['name'], value: project}));
    let questions = [{
        type: 'list',
        name: 'project',
        message: 'Choose the GCloud Project:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['project'];
}

module.exports = selectProject;