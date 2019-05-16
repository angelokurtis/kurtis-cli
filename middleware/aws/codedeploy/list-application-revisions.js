'use strict';

const sh = require('../../bash');
const Aigle = require('aigle');

async function listApplicationRevisions(applicationName) {
    if (!applicationName) throw new Error('application name should not be null');

    const {revisions} = await sh(`aws deploy list-application-revisions --application-name ${applicationName}`);

    return await Aigle.resolve(revisions).map(revision => require('./get-application-revision')(applicationName, revision));
}

module.exports = listApplicationRevisions;