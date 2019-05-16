'use strict';

const bash = require('../bash');

async function setPreferred(namespace) {
    if (!namespace) throw new Error('namespace should not be null');

    await bash(`kubectl config set-context $(kubectl config current-context) --namespace=${namespace}`, true);
}

module.exports = setPreferred;