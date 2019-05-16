'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function rmImages() {
    const ids = await require('./select-images')();
    if (ids.length > 0) return await bash(`docker rmi --force ${ids.join(' ')}`, true);
    return ids;
}

module.exports = rmImages;