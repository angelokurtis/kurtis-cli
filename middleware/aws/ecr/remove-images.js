'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');

async function removeImages(repositoryName, imagesDigests) {
    if (!repositoryName) throw new Error('repository name should not be null');
    if (!imagesDigests || imagesDigests.length === 0) throw new Error('images digests should not be null or empty');

    const digests = await Aigle.resolve(imagesDigests).map(digest => ({imageDigest: digest}));
    await bash(`aws ecr batch-delete-image --repository-name ${repositoryName} --image-ids '${JSON.stringify(digests)}'`, true);
    return digests;
}

module.exports = removeImages;