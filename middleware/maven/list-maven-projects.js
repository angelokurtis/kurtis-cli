'use strict';

const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);
const bash = require('./../bash');
const path = require('path');

async function listMavenProjects(projectPath) {
    projectPath = projectPath || './';
    projectPath = `${path.resolve(projectPath)}/`;

    const projects = await bash(`find ${projectPath} -type f -iname 'pom.xml'`);
    return await Aigle.map(projects, project => project.replace('/pom.xml', ''));
}


module.exports = listMavenProjects;