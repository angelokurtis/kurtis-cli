'use strict';

const ROOT_PATH = '../../../..';

const util = require('util');
const cli = require('caporal');
const sh = require(`${ROOT_PATH}/middleware/bash`);
const exec = util.promisify(require('child_process').exec);

const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function exportAll() {
    try {
        const names = await sh(`kubectl get CustomResourceDefinition -o name`);
        // const names = ["customresourcedefinition.apiextensions.k8s.io/adapters.config.istio.io"];
        const crds = [];
        for (const name of names) {
            crds.push('---');
            const crd = await getYaml(`kubectl get ${name} -o yaml`);
            crds.push(crd)
        }
        handle.success(crds.join("\n"));
    } catch (e) {
        handle.error(e);
    }
}

async function getYaml(command) {
    const {stdout, stderr} = await exec(command, {maxBuffer: 1024 * 50000});
    if (stderr) throw stderr;
    return stdout;
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(exportAll);
};
