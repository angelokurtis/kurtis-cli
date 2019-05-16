'use strict';

const ROOT_PATH = '../../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');
const Aigle = require('aigle');

async function remove(args, {repository}) {
    try {
        if (!repository) {
            const repositories = await require(`${ROOT_PATH}/middleware/aws/ecr/repositories`)();
            let questions1 = [{
                type: 'list',
                name: 'repository',
                message: 'Choose the Repository:',
                choices: repositories
            }];
            const answers1 = await inquirer.prompt(questions1);
            repository = answers1['repository'];
        }
        const images = await require(`${ROOT_PATH}/middleware/aws/ecr/images`)(repository);
        const choices = await Aigle.resolve(images)
            .map(function (image) {
                let {imageDigest, imageTags} = image;
                imageDigest = imageDigest.replace('sha256:', '').substring(0, 12);
                return {name: `${imageDigest} [${imageTags.join(', ')}]`, value: image, short: 'test'};
            });
        let questions2 = [{
            type: 'checkbox',
            name: 'images-to-remove',
            message: 'Choose the revisions that you want remove:',
            choices: choices
        }];
        const answers2 = await inquirer.prompt(questions2);
        const imagesToRemove = answers2['images-to-remove'];
        handle.success(imagesToRemove);
        let question3 = {type: 'confirm', name: 'confirmation', message: 'Are you sure?'};
        const {confirmation} = await inquirer.prompt(question3);
        if (confirmation) {
            const digests = await Aigle.resolve(imagesToRemove).map(({imageDigest}) => imageDigest);
            await require(`${ROOT_PATH}/middleware/aws/ecr/remove-images`)(repository, digests);
        }
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--repository <repository>', 'The repository name', cli.STRING)
        .action(remove);
};
