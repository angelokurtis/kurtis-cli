'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

function listAccounts() {
    return bash(`gcloud auth list --format="value(account)"`);
}

module.exports = listAccounts;