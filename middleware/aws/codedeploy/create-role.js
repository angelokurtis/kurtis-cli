'use strict';

const readFile = require('util').promisify(require('fs').readFile);
const sh = require('../../bash');

async function createRole() {
    const skeleton = JSON.parse(await readFile(`${__dirname}/ecs-codedeploy-role-skeleton.json`, 'utf8'));

    const {Role: role} = await sh(`aws iam create-role --cli-input-json '${JSON.stringify(skeleton)}'`, true);
    const {RoleName: name} = role;
    await sh(`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS --role-name ${name}`, true);
    await sh(`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSCodeDeployRoleForECSLimited --role-name ${name}`, true);
    return role;
}

module.exports = createRole;