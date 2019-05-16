'use strict';

const bash = require('../../bash');
const util = require('util');
const fs = require('fs');
const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);
const writeFile = util.promisify(fs.writeFile);

async function environmentSnapshot(services) {
    const snap = [];

    if (services.includes('instances')) snap.push(snapshotInstances());
    if (services.includes('images')) snap.push(snapshotImages());
    if (services.includes('volumes')) snap.push(snapshotVolumes());
    if (services.includes('vpcs')) snap.push(snapshotVpcs());
    if (services.includes('subnets')) snap.push(snapshotSubnets());
    if (services.includes('security-groups')) snap.push(snapshotSecurityGroups());
    if (services.includes('network-interfaces')) snap.push(snapshotNetworkInterfaces());
    if (services.includes('load-balancers')) snap.push(snapshotLoadBalancers());
    if (services.includes('target-groups')) snap.push(snapshotTargetGroups());
    if (services.includes('auto-scaling-groups')) snap.push(snapshotAutoScalingGroups());
    if (services.includes('policies')) snap.push(snapshotPolicies());
    if (services.includes('roles')) snap.push(snapshotRoles());

    return Promise.all(snap);
}

async function snapshotInstances() {
    console.log('getting running instances...');
    let {Reservations} = await bash('aws ec2 describe-instances', true);
    await Aigle
        .flatMap(Reservations, reservation => reservation['Instances'])
        .filter(({State}) => State.Code !== 48)
        .forEach(async function (instance) {
            const path = 'ec2';
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            await writeFile(`./${path}/${instance.InstanceId}.json`, JSON.stringify(instance, null, 2));
        });
    console.log('instances were caught!');
}

async function snapshotImages() {
    console.log('getting images...');
    let {Images} = await bash('aws ec2 describe-images', true);
    await Aigle.forEach(Images, async function (image) {
        const path = 'ami';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${image.ImageId}.json`, JSON.stringify(image, null, 2));
    });
    console.log('images were caught!');
}

async function snapshotVolumes() {
    console.log('getting volumes...');
    let {Volumes} = await bash('aws ec2 describe-volumes', true);
    await Aigle.forEach(Volumes, async function (volume) {
        const path = 'volume';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${volume.VolumeId}.json`, JSON.stringify(volume, null, 2));
    });
    console.log('volumes were caught!');
}

async function snapshot() {
    let {Snapshots} = await bash('aws ec2 describe-snapshots');
    await Aigle.forEach(Snapshots, async function (snapshot) {
        const path = 'snapshot';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${snapshot.SnapshotId}.json`, JSON.stringify(snapshot, null, 2));
    });
}

async function snapshotVpcs() {
    console.log('getting non default vpcs...');
    let {Vpcs} = await bash('aws ec2 describe-vpcs', true);
    await Aigle
        .filter(Vpcs, ({IsDefault}) => !IsDefault)
        .forEach(async function (vpc) {
            const path = 'vpc';
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            await writeFile(`./${path}/${vpc.VpcId}.json`, JSON.stringify(vpc, null, 2));
        });
    console.log('vpcs were caught!');
}

async function snapshotSubnets() {
    console.log('getting non default subnets...');
    let {Subnets} = await bash('aws ec2 describe-subnets', true);
    await Aigle
        .filter(Subnets, ({DefaultForAz}) => !DefaultForAz)
        .forEach(async function (subnet) {
            const path = 'subnet';
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            await writeFile(`./${path}/${subnet.SubnetId}.json`, JSON.stringify(subnet, null, 2));
        });
    console.log('subnets were caught!');
}

async function snapshotSecurityGroups() {
    console.log('getting security groups...');
    let {SecurityGroups} = await bash('aws ec2 describe-security-groups', true);
    await Aigle
        .filter(SecurityGroups, ({GroupName}) => GroupName !== 'default')
        .forEach(async function (securityGroup) {
            const path = 'security-group';
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            await writeFile(`./${path}/${securityGroup.GroupId}.json`, JSON.stringify(securityGroup, null, 2));
        });
    console.log('security group were caught!');
}

async function snapshotNetworkInterfaces() {
    console.log('getting networks...');
    let {NetworkInterfaces} = await bash('aws ec2 describe-network-interfaces', true);
    await Aigle.forEach(NetworkInterfaces, async function (networkInterface) {
        const path = 'network-interface';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${networkInterface.NetworkInterfaceId}.json`, JSON.stringify(networkInterface, null, 2));
    });
    console.log('networks were caught!');
}

async function snapshotLoadBalancers() {
    console.log('getting load balancers...');
    let {LoadBalancerDescriptions} = await bash('aws elbv2 describe-load-balancers', true);
    await Aigle.forEach(LoadBalancerDescriptions, async function (loadBalancer) {
        const path = 'load-balancer';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${loadBalancer.LoadBalancerName}.json`, JSON.stringify(loadBalancer, null, 2));
    });
    console.log('load balancers were caught!');
}

async function snapshotTargetGroups() {
    console.log('getting target groups...');
    let {TargetGroups} = await bash('aws elbv2 describe-target-groups', true);
    await Aigle.forEach(TargetGroups, async function (targetGroup) {
        const path = 'target-group';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${targetGroup.TargetGroupName}.json`, JSON.stringify(targetGroup, null, 2));
    });
    console.log('target groups were caught!');
}

async function snapshotAutoScalingGroups() {
    console.log('getting auto scaling groups...');
    let {AutoScalingGroups} = await bash('aws autoscaling describe-auto-scaling-groups', true);
    await Aigle.forEach(AutoScalingGroups, async function (autoScalingGroup) {
        const path = 'auto-scaling-group';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await writeFile(`./${path}/${autoScalingGroup.AutoScalingGroupName}.json`, JSON.stringify(autoScalingGroup, null, 2));
    });
    console.log('auto scaling groups were caught!');
}

async function snapshotPolicies() {
    console.log('getting policies...');
    let {Policies} = await bash('aws iam list-policies --scope All', true);
    await Aigle.forEach(Policies, async function (policy) {
        const path = 'policy';
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        policy.Document = await getPolicyDocument(policy.Arn, policy.DefaultVersionId);
        await writeFile(`./${path}/${policy.PolicyName}.json`, JSON.stringify(policy, null, 2));
    });
    console.log('policies were caught!');
}

async function snapshotRoles() {
    console.log('getting roles...');
    let {Roles} = await bash('aws iam list-roles', true);
    await Aigle.resolve(Roles)
        .filter(({Path: path}) => !path.startsWith('/aws-service-role/'))
        .forEach(async function (role) {
            const path = 'role';
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            role.AttachedPolicies = await listAttachedRolePolicies(role.RoleName);
            role.InlinePolicies = await listInlineRolePolicies(role.RoleName);
            await writeFile(`./${path}/${role.RoleName}.json`, JSON.stringify(role, null, 2));
        });
    console.log('roles were caught!');
}

async function listAttachedRolePolicies(roleName) {
    if (!roleName) throw new Error('role name should not be null');

    let {AttachedPolicies: policies} = await bash(`aws iam list-attached-role-policies --role-name ${roleName}`, true);
    return policies;
}

async function listInlineRolePolicies(roleName) {
    if (!roleName) throw new Error('role name should not be null');

    let {PolicyNames: policies} = await bash(`aws iam list-role-policies --role-name ${roleName}`, true);
    return await Aigle.resolve(policies).map(policy => describeInlinePolicy(roleName, policy));
}

async function describeInlinePolicy(roleName, policyName) {
    if (!roleName) throw new Error('role name should not be null');
    if (!policyName) throw new Error('policy name should not be null');

    const policy = await bash(`aws iam get-role-policy --role-name ${roleName} --policy-name ${policyName}`, true);
    delete policy.RoleName;
    return policy;
}

async function getPolicyDocument(policyArn, versionId) {
    if (!policyArn) throw new Error('policy arn should not be null');
    if (!versionId) throw new Error('version id should not be null');

    let {PolicyVersion: version} = await bash(`aws iam get-policy-version --policy-arn ${policyArn} --version-id ${versionId}`, true);
    return version.Document;
}

module.exports = environmentSnapshot;