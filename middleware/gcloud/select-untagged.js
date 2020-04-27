'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
const inquirer = require('inquirer');

async function selectUntagged() {
    let tags = await Aigle.resolve(bash('gcloud container images list --format json', true))
        .flatMap(listTags)
        .map(({image}) => {
            return {image};
        });

    let choices = await Aigle.resolve(tags).map(tag => ({name: tag.image, value: tag}));
    let questions = [{
        pageSize: 20,
        type: 'checkbox',
        name: 'tags',
        message: 'Choose the tags:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['tags'];
}

function listTags(image) {
    const {name} = image;
    return Aigle.resolve(bash(`gcloud container images list-tags ${name} --filter="NOT tags:*" --format json`, true))
        .map(function (untagged) {
            untagged['image'] = name;
            return untagged
        });
}

module.exports = selectUntagged;