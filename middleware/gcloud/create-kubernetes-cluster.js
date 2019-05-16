'use strict';

const bash = require('../bash');
const inquirer = require('inquirer');
const FG_BLUE = "\x1b[34m%s\x1b[0m";

async function createKubernetesCluster(projectId, computeZone) {
    let {projectId: project} = projectId ? {projectId} : await require('./select-project')();
    let {name: zone} = computeZone ? {name: computeZone} : await require('./select-zone')();

    try {
        await bash(`gcloud config set project ${project}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }
    try {
        await bash(`gcloud config set compute/zone ${zone}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('Updated')) throw e;
    }

    let questions = [
        {name: 'cluster', message: 'Type the GCloud Kubernetes cluster name:'},
        {name: 'num-nodes', message: 'Type the number of nodes to be created:'}
    ];
    const answers = await inquirer.prompt(questions);
    const clusterName = answers['cluster'];
    const numNodes = answers['num-nodes'];

    console.log(FG_BLUE, `gcloud container --project '${project}' clusters create '${clusterName}' --zone '${zone}' --num-nodes '${numNodes}'`);
    try {
        await bash(`gcloud container --project '${project}' clusters create '${clusterName}' --zone '${zone}' --num-nodes '${numNodes}' --no-enable-basic-auth --cluster-version '1.12.7-gke.7' --machine-type 'g1-small' --image-type 'COS' --disk-type 'pd-standard' --disk-size '30' --scopes 'https://www.googleapis.com/auth/devstorage.read_only','https://www.googleapis.com/auth/logging.write','https://www.googleapis.com/auth/monitoring','https://www.googleapis.com/auth/servicecontrol','https://www.googleapis.com/auth/service.management.readonly','https://www.googleapis.com/auth/trace.append' --no-enable-cloud-logging --no-enable-cloud-monitoring --no-enable-ip-alias --network 'projects/kurtis-kube-labs/global/networks/default' --subnetwork 'projects/kurtis-kube-labs/regions/${zone}/subnetworks/default' --addons HorizontalPodAutoscaling,HttpLoadBalancing --enable-autoupgrade --enable-autorepair`);
    } catch (e) {
        if (!e.includes || !e.includes('Created')) throw e;
    }
    try {
        await bash(`gcloud container clusters get-credentials ${clusterName}`, true);
    } catch (e) {
        if (!e.includes || !e.includes('kubeconfig entry generated')) throw e;
    }
}

module.exports = createKubernetesCluster;