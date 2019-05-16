'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');
const Aigle = require('aigle');
const _ = require('lodash');
const os = require('os');
const sh = require(`${ROOT_PATH}/middleware/bash`);

async function sync() {
    try {
        const photos = await require(`${ROOT_PATH}/middleware/photos/list-all-photos`)();
        const thumbnails = await Aigle
            .resolve(await require(`${ROOT_PATH}/middleware/photos/list-all-thumbnails`)())
            .map(key => key.replace('resized-', ''));

        const photosWithoutThumb = _.difference(photos, thumbnails);
        handle.success('There are ' + photosWithoutThumb.length + ' to sync');
        let questions = [{
            type: 'checkbox',
            name: 'photo-to-sync',
            message: 'Choose the photos to generate the thumbnail:',
            choices: photosWithoutThumb
        }];
        const answers = await inquirer.prompt(questions);
        const photoToSync = answers['photo-to-sync'];

        await Aigle.resolve(photoToSync).forEach(createThumbnail);

    } catch (e) {
        handle.error(e);
    }
}

async function createThumbnail(photoKey) {
    if (!photoKey) throw new Error('photo key should not be null');

    const payload = {
        Records: [{
            eventSource: 'aws:s3',
            eventName: 'ObjectCreated:Put',
            s3: {
                bucket: {name: 'kurtis-photos', arn: 'arn:aws:s3:::kurtis-photos'},
                object: {key: photoKey}
            }
        }]
    };

    await sh(`aws --profile kurtis-photos lambda invoke --function-name CreateThumbnail --invocation-type Event --payload '${JSON.stringify(payload)}' ${os.tmpdir()}/thumbnail-creation.log`, true);
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(sync);
};
