'use strict';

const ROOT_PATH = '../../../../../../../';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const inquirer = require('inquirer');

async function list(args, {taskDefinition}) {
    try {
        if (!taskDefinition) {
            const families = await require(`${ROOT_PATH}/middleware/aws/ecs/families`)();
            let questions = [{
                type: 'list',
                name: 'task-definition',
                message: 'Choose the Task Definition that you want list its revisions:',
                choices: families
            }];
            const answers = await inquirer.prompt(questions);
            taskDefinition = answers['task-definition'];
        }
        const revisions = await require(`${ROOT_PATH}/middleware/aws/ecs/task-definition-revisions`)(taskDefinition);
        handle.success(revisions);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--task-definition <task-definition>', 'The Task Definition', cli.STRING)
        .action(list);
};
