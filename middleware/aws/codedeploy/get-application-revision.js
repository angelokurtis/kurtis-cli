'use strict';

const sh = require('../../bash');

async function getApplicationRevision(applicationName, revision) {
    if (!applicationName) throw new Error('application name should not be null');
    if (!revision) throw new Error('revision should not be null');

    if (revision['revisionType'] === 'AppSpecContent') {
        return revision;
    } else {
        const revisionDetails = await sh(`aws deploy get-application-revision --application-name ${applicationName} --cli-input-json '${JSON.stringify({revision})}'`);
        delete revisionDetails.applicationName;
        return revisionDetails;
    }
}

module.exports = getApplicationRevision;