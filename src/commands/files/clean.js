'use strict';

const ROOT_PATH = '../../..';

const cli = require('caporal');
const bash = require(`${ROOT_PATH}/middleware/bash`);
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const rimraf = require('rimraf');
const Aigle = require('aigle');

async function clean(args, {byExtension}) {
    try {
        let total = await bash('du -sh . | cut -f1');
        console.log(`Total size = ${total}\n`);
        let extension;
        if (byExtension) {
            extension = await require(`${ROOT_PATH}/middleware/files/select-extension`)();
        }
        let files = await require(`${ROOT_PATH}/middleware/files/select-files`)(extension);
        Aigle.resolve(files)
            .map(({name}) => name)
            .forEach(file => rimraf.sync(file));
        handle.success(files);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--by-extension', 'Find by extension', cli.BOOLEAN)
        .action(clean);
};
