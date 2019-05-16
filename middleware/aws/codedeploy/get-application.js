'use strict';

const sh = require('../../bash');

async function getApplication(applicationName) {
    if (!applicationName) throw new Error('application name should not be null');

    const {application} = await sh(`aws deploy get-application --application-name ${applicationName}`);
    application.revisions = await require('./list-application-revisions')(applicationName);
    return application;
}

module.exports = getApplication;