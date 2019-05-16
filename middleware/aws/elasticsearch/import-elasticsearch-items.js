'use strict';

const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);
const bash = require('../../bash');
const ec2 = 'ec2-54-233-254-210.sa-east-1.compute.amazonaws.com';
const sshCommand = `ssh -i ~/dev/keys/<key-name>.pem ec2-user@${ec2}`;

const endpoint = 'http://<elasticsearchaddress>';

async function importElasticsearchItems(environmentName) {
    if (!environmentName) throw new Error('environment name should not be null');

    let items = await allItems();
    await Aigle.forEach(items, async ({_index, _type, _id, _source}) =>
        await bash(`curl -s -X PUT http://localhost:4571/${_index}/${_type}/${_id} -H 'Content-Type: application/json' -d '${JSON.stringify(_source)}'`, true));
}

async function allItems() {
    let totalOfItems = await total();
    const {hits} = await bash(`${sshCommand} "curl -s -X POST '${endpoint}/claims/_search?size=${totalOfItems}'"`);
    return hits.hits;
}

async function total() {
    const {hits} = await bash(`${sshCommand} "curl -s -H 'Accept: application/json' '${endpoint}/claims/_search'"`);
    return hits.total;
}

module.exports = importElasticsearchItems;