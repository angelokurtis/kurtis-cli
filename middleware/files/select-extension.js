'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');
const readdir = require('util').promisify(require('fs').readdir);
const path = require('path');

async function selectExtension() {
    const extensions = await listExtensions();
    const length = extensions.length;
    if (length > 1) {
        const questions = [{
            pageSize: 20,
            type: 'list',
            name: 'extension',
            message: 'Choose the extension:',
            choices: extensions
        }];
        const answers = await inquirer.prompt(questions);
        return answers['extension'];
    } else if (length === 1) {
        return extensions[0]
    } else return null;
}

async function listExtensions() {
    return Aigle.resolve(await readdir('./'))
        .map(file => path.extname(file))
        .filter(extension => extension.length > 0)
        .uniq();
}

module.exports = selectExtension;