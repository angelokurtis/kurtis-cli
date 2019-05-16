'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function availableImagePrefixes() {

    let repositories = await bash(`docker images --format '{{.Repository}}'`);
    return Aigle
        .uniq(repositories)
        .filter(repository => repository.includes('/'))
        .map(repository => repository.split('/')[0])
        .uniq();
}

module.exports = availableImagePrefixes;