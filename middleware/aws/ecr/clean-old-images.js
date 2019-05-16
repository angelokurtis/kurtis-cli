'use strict';

const bash = require('../../bash');
const _ = require('lodash');

async function cleanOldImages(repositoryName) {
    if (!repositoryName) throw new Error('repository name should not be null');

    const {imageIds} = await bash(`aws ecr list-images --repository-name ${repositoryName}`);
    const untaggedImages = _.filter(imageIds, imageId => imageId.imageTag === undefined);
    if (untaggedImages.length > 0) await bash(`aws ecr batch-delete-image --repository-name ${repositoryName} --image-ids '${JSON.stringify(untaggedImages)}'`, true);
    return untaggedImages;
}

module.exports = cleanOldImages;