'use strict';

const ROOT_PATH = '../../../../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');

async function remove(args, {taskDefinition}) {
    try {
        if (!taskDefinition) {
            const families = await require(`${ROOT_PATH}/middleware/aws/ecs/families`)();
            let questions1 = [{
                type: 'list',
                name: 'task-definition',
                message: 'Choose the Task Definition family:',
                choices: families
            }];
            const answers1 = await inquirer.prompt(questions1);
            taskDefinition = answers1['task-definition'];
        }
        const revisions = await require(`${ROOT_PATH}/middleware/aws/ecs/task-definition-revisions`)(taskDefinition);
        let questions2 = [{
            type: 'checkbox',
            name: 'revisions-to-remove',
            message: 'Choose the revisions that you want remove:',
            choices: revisions
        }];
        const answers2 = await inquirer.prompt(questions2);
        const revisionsToRemove = answers2['revisions-to-remove'];
        handle.success(revisionsToRemove);
        let question3 = {type: 'confirm', name: 'confirmation', message: 'Are you sure?'};
        const {confirmation} = await inquirer.prompt(question3);
        if (confirmation) {
            await require(`${ROOT_PATH}/middleware/aws/ecs/remove-task-definition-revisions`)(revisionsToRemove);
        }
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--task-definition <task-definition>', 'The Task Definition', cli.STRING)
        .action(remove);
};
