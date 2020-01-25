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
        await Promise.all[
            Aigle
                .resolve(intellij.concat(netbeans).concat(eclipse))
                .flatMap(file => sh(`find ${projectPath} -iname '${file}' -type d`, false))
                .filter(file => file.length > 0)
                .forEach(file => sh(`rm -rf '${file}'`, true)),
                Aigle
                    .resolve(intellij.concat(netbeans).concat(eclipse))
                    .flatMap(file => sh(`find ${projectPath} -iname '${file}' -type f`, false))
                    .filter(file => file.length > 0)
                    .forEach(file => sh(`rm '${file}'`, true))
            ]
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

const netbeans = [
    '**/nbproject/private/',
    '**/nbproject/Makefile-*.mk',
    '**/nbproject/Package-*.bash',
    'build/',
    'nbbuild/',
    'dist/',
    'nbdist/',
    '.nb-gradle/'
];

const eclipse = [
    '.metadata',
    'bin/',
    'tmp/',
    '*.tmp',
    '*.bak',
    '*.swp',
    '*~.nib',
    'local.properties',
    '.settings/',
    '.loadpath',
    '.recommenders',
    '.externalToolBuilders/',
    '*.launch',
    '*.pydevproject',
    '.cproject',
    '.autotools',
    '.factorypath',
    '.buildpath',
    '.target',
    '.tern-project',
    '.texlipse',
    '.springBeans',
    '.recommenders/',
    '.apt_generated/',
    '.cache-main',
    '.scala_dependencies',
    '.worksheet'
];