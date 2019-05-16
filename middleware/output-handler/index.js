const ERROR_PATTERN = "\x1b[31m%s\x1b[0m";
const EventEmitter = require('events');
const Aigle = require('aigle');

class OutputHandler extends EventEmitter {
    success(output) {
        this.emit('success', output);
    }

    error(error) {
        this.emit('error', error);
    }
}

const handler = new OutputHandler();

handler.on('success', (output) => {
    if (typeof output === 'object') console.log(JSON.stringify(removeNulls(output), null, 2));
    else console.log(output);
});

handler.on('error', async (error) => {
    const {stack} = error;
    if (stack) {
        const cleanStack = await Aigle.resolve(stack.split('\n')).filter(item => !item.includes('/node_modules/'));
        return console.error(ERROR_PATTERN, cleanStack.join('\n'));
    } else return console.error(ERROR_PATTERN, error);
});

function removeNulls(target) {
    Object.keys(target).map(function (key) {
        if (target[key] instanceof Object) {
            if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
                delete target[key];
            } else {
                removeNulls(target[key]);
            }
        } else if (target[key] === null) {
            delete target[key];
        }
    });
    return target;
}

module.exports = handler;