'use strict';

const Aigle = require('aigle');
const inquirer = require('inquirer');
const util = require('util');
const readdir = util.promisify(require('fs').readdir);
const stat = util.promisify(require('fs').stat);
const getSize = util.promisify(require('get-folder-size'));
const path = require('path');

async function selectFiles(extension) {
    const files = await listFiles(extension);
    let choices = await Aigle.resolve(files).map(file => ({
        name: ` [${file.type}] ${file.size}   ${file.name}`,
        value: file
    }));
    let questions = [{
        pageSize: 20,
        type: 'checkbox',
        name: 'files',
        message: 'Choose the files:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['files'];
}

async function listFiles(extension) {
    return Aigle.resolve(await readdir('./'))
        .map(async file => {
            const ext = path.extname(file);
            return {name: file, extension: ext};
        })
        .filter(({extension: ext}) => extension ? extension === ext : true)
        .map(async function ({name, extension}) {
            const stats = await stat(name);
            const type = stats.isDirectory() ? 'd' : 'f';
            let size = null;
            try {
                size = stats.isDirectory() ? await getSize(name) : stats.size;
            } catch (e) {
            }
            return {name, type, size, extension};
        })
        .filter(({size}) => size !== null)
        .orderBy('size', 'desc')
        .map(({name, type, size, extension}) => ({name, type, extension, size: require('./format-size')(size)}))
}

module.exports = selectFiles;