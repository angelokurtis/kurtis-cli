'use strict';

const cli = require('caporal');
const handle = require('../../../middleware/output-handler');
const path = require('path');
const JSON5 = require('json5');

async function jsonToXls(args, {file, json}) {
    try {
        if (file) {
            file = path.resolve(file);
            const elements = require(file);
            const filename = path.basename(file, '.json').split('.')[0];
            console.log(`Starting writing xlsx file...`);
            await require('../../../middleware/xlsx/json-to-spreadsheet')(elements, filename);
            console.log(`Finished to write xlsx file!`);
        } else {
            if (!json) throw new Error('json should not be null');
            console.log(json);
            json = JSON5.parse(json);
            console.log(`Starting writing xlsx file...`);
            await require('../../../middleware/xlsx/json-to-spreadsheet')(json);
            console.log(`Finished to write xlsx file!`);
        }
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-f, --file <file>', '', cli.STRING)
        .option('-j, --json <json>', '', cli.STRING)
        .action(jsonToXls);
};
