'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function rmUntagged() {
    const tags = await require('./select-untagged')();
    if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            await bash(`gcloud container images untag ${tags[i]} --quiet`, true);
        }
    }
}

module.exports = rmUntagged;