'use strict';

const cli = require('caporal');
const handle = require('../../../middleware/output-handler');
const path = require('path');

async function jsonToCsv(args, {file}) {
    try {
        if (!file) throw new Error('file should not be null');
        file = path.resolve(file);
        const elements = require(file);
        const filename = path.basename(file, '.json').split('.')[0];
        console.log(`Starting writing xlsx file...`);
        await require('../../../middleware/xlsx/json-to-spreadsheet')(elements, filename);
        console.log(`Finished to write xlsx file!`);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-f, --file <file>', '', cli.STRING)
        .action(jsonToCsv);
};
