'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectProject() {
    let projects = await require('./list-projects')();
    const length = projects.length;
    if (length > 1) {
        let choices = await Aigle.resolve(projects).map(project => ({
            name: `${project['projectId']} (${project['name']})`,
            value: project
        }));
        let questions = [{
            type: 'list',
            name: 'project',
            message: 'Choose the GCloud Project:',
            choices
        }];
        const answers = await inquirer.prompt(questions);
        return answers['project'];
    } else if (length === 1) {
        return projects[0]
    } else return null;
}

module.exports = selectProject;