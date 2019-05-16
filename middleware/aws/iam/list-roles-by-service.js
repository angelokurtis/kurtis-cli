'use strict';

const Aigle = require('aigle');
const sh = require('../../bash');

async function listRolesByService(serviceName) {
    if (!serviceName) throw new Error('service name should not be null');

    const {Roles: roles} = await sh('aws iam list-roles');
    return await Aigle.resolve(roles)
        .filter(async ({AssumeRolePolicyDocument: document}) => {
            const {Statement: statements} = document;
            const services = await Aigle.resolve(statements)
                .map(({Principal}) => Principal)
                .flatMap(({Service}) => Service);
            return services.includes(serviceName)
        });
}

module.exports = listRolesByService;