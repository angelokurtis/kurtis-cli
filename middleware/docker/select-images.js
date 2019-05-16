'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
const inquirer = require('inquirer');

async function selectImages() {
    const images = await listImages();
    let choices = await Aigle.resolve(images).map(({image, id}) => ({name: image, value: id}));
    let questions = [{
        type: 'checkbox',
        name: 'images',
        message: 'Choose the Docker Images:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['images'];
}

async function listImages() {
    const images = await bash(`docker images --format '{{json .}}'`, true);
    return Aigle.resolve(images)
        .map(image => JSON.parse(image))
        .map(({Repository, Tag, ID: id}) => ({image: `${Repository}:${Tag}`, id}))
}


module.exports = selectImages;