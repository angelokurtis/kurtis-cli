'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
const inquirer = require('inquirer');

async function selectTags() {
    let tags = await Aigle.resolve(bash('gcloud container images list --format json'))
        .flatMap(listTags)
        .flatMap(({image, digest, tags}) => {
            const result = [];
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                result.push({tag: `${image}:${tag}`, digest})
            }
            return result;
        });

    let choices = await Aigle.resolve(tags).map(({tag}) => ({name: tag, value: tag}));
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
    return Aigle.resolve(bash(`gcloud container images list-tags ${name} --filter="tags:*" --format json`))
        .map(function (tag) {
            tag['image'] = name;
            return tag
        });
}

module.exports = selectTags;