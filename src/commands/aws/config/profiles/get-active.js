'use strict';

const cli = require('caporal');
const AppContext = require('../../../../../context/index');
const handle = require('../../../../../middleware/output-handler/index');

async function getActive(args, options) {
    try {
        const profiles = AppContext.profiles();
        const profile = await profiles.getActive();
        handle.success(profile);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Obtain the activated AWS profile')
        .action(getActive);
};
