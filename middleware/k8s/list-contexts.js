'use strict';

const bash = require('../bash');

function listContexts() {
    return bash('kubectl config get-contexts -o=name', true);
}

module.exports = listContexts;