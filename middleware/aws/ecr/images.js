'use strict';

const bash = require('../../bash');
const _ = require('lodash');

async function images(repositoryName) {
    if (!repositoryName) throw new Error('repository name should not be null');

    const images = await bash(`aws ecr describe-images --repository-name ${repositoryName} --query 'imageDetails'`);
    return _.map(images, image => {
        const longDate = image.imagePushedAt;
        image.imagePushedAt = new Date(longDate * 1000);
        image.imageSize = formatFileSize(image.imageSizeInBytes);
        delete image.imageSizeInBytes;
        return image;
    });
}

function formatFileSize(bytes, decimalPoint) {
    if (bytes === 0) return '0 Bytes';
    const k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


module.exports = images;