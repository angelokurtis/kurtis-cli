'use strict';

const ROOT_PATH = '../..';
const sh = require(`${ROOT_PATH}/middleware/bash`);
const Aigle = require('aigle');

async function listAllPhotos() {
    let {NextToken: token, Contents: objects} = await sh("aws --profile 'kurtis-photos' s3api list-objects --bucket kurtis-photos ", true);
    while (token) {
        let {NextToken, Contents} = await sh(`aws --profile 'kurtis-photos' s3api list-objects --bucket kurtis-photos --starting-token ${token}`, true);
        token = NextToken;
        objects = objects.concat(Contents);
    }
    return await Aigle.resolve(objects).map(({Key}) => Key);
}

module.exports = listAllPhotos;