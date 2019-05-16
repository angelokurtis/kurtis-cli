'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

function listAccounts() {
    return bash(`gcloud auth list --format="value(account)"`, true);
}

module.exports = listAccounts;