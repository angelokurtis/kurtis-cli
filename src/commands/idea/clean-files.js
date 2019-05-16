'use strict';

const cli = require('caporal');
const handle = require('../../../middleware/output-handler');
const sh = require('../../../middleware/bash');
const Aigle = require('aigle');
const _ = require('lodash');
const path = require('path');

async function cleanFiles(args, {projectPath}) {
    projectPath = projectPath || '.';
    projectPath = `${path.resolve(projectPath)}/`;
    try {
        await Aigle
            .resolve(intellij.concat(netbeans).concat(eclipse))
            .flatMap(file => sh(`find ${projectPath} -iname '${file}'`))
            .filter(file => file.length > 0)
            .forEach(file => sh(`rm -rf '${file}'`, true))
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Remove all IDEA files')
        .action(cleanFiles);
};

const intellij = [
    '.idea',
    '*.iml'
];

const netbeans = [];

const eclipse = [];