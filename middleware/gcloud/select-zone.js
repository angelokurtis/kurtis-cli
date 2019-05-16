'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function selectZone() {
    let zones = [
        {name: "asia-east1", description: "Taiwan"},
        {name: "asia-northeast1", description: "Tóquio"},
        {name: "asia-southeast1", description: "Cingapura"},
        {name: "australia-southeast1", description: "Sydney"},
        {name: "europe-west1", description: "Bélgica"},
        {name: "europe-west2", description: "Londres"},
        {name: "europe-west3", description: "Frankfurt"},
        {name: "southamerica-east1", description: "São Paulo"},
        {name: "us-central1", description: "Iowa"},
        {name: "us-east1", description: "Carolina do Sul"},
        {name: "us-east4", description: "Virgínia do Norte"},
        {name: "us-west1", description: "Oregon"}
    ];
    let choices = await Aigle.resolve(zones).map(zone => ({name: zone['description'], value: zone}));
    let questions = [{
        type: 'list',
        name: 'zone',
        message: 'Choose the GCloud Zone:',
        choices
    }];
    const answers = await inquirer.prompt(questions);
    return answers['zone'];
}

module.exports = selectZone;