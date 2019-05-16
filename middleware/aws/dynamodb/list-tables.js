'use strict';

const bash = require('../../bash');

async function listTables(environmentName) {
    if (!environmentName) throw new Error('environment name should not be null');

    let cli = environmentName === 'development' ? 'awslocal' : 'aws';
    let {TableNames} = await bash(`${cli} dynamodb list-tables`);
    return TableNames;
}

module.exports = listTables;