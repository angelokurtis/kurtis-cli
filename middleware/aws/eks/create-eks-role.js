'use strict';

const bash = require('../../bash');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);

async function createEksRole() {
    const skeleton = JSON.parse(await readFile(`${__dirname}/create-eks-role-skeleton.json`, 'utf8'));

    const {Role} = await bash(`aws iam create-role --cli-input-json '${JSON.stringify(skeleton)}'`, true);
    const eksClusterPolicy = await bash(`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy --role-name ${Role.RoleName}`, true);
    const eksServicePolicy = await bash(`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AmazonEKSServicePolicy --role-name ${Role.RoleName}`, true);
    return Role;
}

module.exports = createEksRole;