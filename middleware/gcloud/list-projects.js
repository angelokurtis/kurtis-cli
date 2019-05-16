'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

function listProjects() {
    return bash(`gcloud projects list --format json`, true);
}

module.exports = listProjects;