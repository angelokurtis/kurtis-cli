'use strict';

const Aigle = require('aigle');
const bash = require('../bash');

async function listNamespaces() {
    const {items: namespaces} = await bash('kubectl get namespaces -o json', true);
    return await Aigle.resolve(namespaces).map(({metadata}) => metadata.name);
}

module.exports = listNamespaces;