'use strict';

const Aigle = require('aigle');
const bash = require('../bash');

async function removeProjects(projectId) {
    let projects = projectId ? [{id: projectId}] : await require('./select-projects')();
    await Aigle
        .resolve(projects)
        .forEach(({projectId}) => {
            try {
                return bash(`gcloud projects delete ${projectId} --async --quiet`, true);
            } catch (e) {
                if (!e.includes || !e.includes('Deleted')) throw e;
            }
        });
}

module.exports = removeProjects;