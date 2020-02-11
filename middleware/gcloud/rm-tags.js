'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function rmTags() {
    const tags = await require('./select-tags')();
    if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            await bash(`gcloud container images untag ${tags[i]} --quiet`, true);
        }
    }
}

module.exports = rmTags;