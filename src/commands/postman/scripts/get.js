'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const path = require('path');
const Aigle = require('aigle');
const fs = require('fs');
const changeCase = require('change-case');
const util = require('util');
const mkdirp = util.promisify(require('mkdirp'));
const writeFile = util.promisify(fs.writeFile);

async function get(args, {collection}) {
    collection = collection || '.';
    collection = `${path.resolve(collection)}`;
    try {
        let raw = fs.readFileSync(collection);
        let {item: items} = JSON.parse(raw);
        let scenarios = await extractScenarios(items);
        // handle.success(scenarios);
        // await save(scenarios);
        // handle.success('saved!');
    } catch (e) {
        handle.error(e);
    }
}

function extractScenarios(items, path) {
    return Aigle.resolve(items)
        .flatMap(async function ({name, item, event: events, _postman_isSubFolder}, index) {
            console.log({name, events: events ? events.length : 0, _postman_isSubFolder})
            if (!events || _postman_isSubFolder) {
                let newPath = path || '';
                newPath += `/${index}-${changeCase.paramCase(name)}`;
                return await extractScenarios(item, newPath);
            } else {
                let scripts = await extractScripts(events);
                return {path, name, scripts};
            }
        });
}

function extractScripts(events) {
    return Aigle.resolve(events)
        .filter(({listen, script}) => listen === 'test' && script)
        .map(({script}) => script)
        .filter(({type, exec}) => type === 'text/javascript' && exec)
        .map(function ({id, exec}) {
            return {id, script: exec.join('\n')}
        })
        .filter(({script}) => script.length > 0);
}

function save(scenarios) {
    return Aigle.resolve(scenarios)
        .forEach(async function ({path, name, scripts}, index) {
            const filePath = `./postman/${path}`;
            await mkdirp(filePath);
            await Aigle.resolve(scripts)
                .forEach(async ({id, script}) => {
                    const s = `${filePath}/${index}-${changeCase.paramCase(name)}.js`;
                    // console.log(s)
                    await writeFile(s, script);
                })
        })

}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-c, --collection <collection>', '', cli.STRING)
        .action(get);
};
