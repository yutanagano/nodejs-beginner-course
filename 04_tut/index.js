const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};

// initialise object
const myEmitter = new MyEmitter();

// add listener for the log event
myEmitter.on('log', msg => logEvents(msg));

setTimeout(() => {
    // Emite event
    myEmitter.emit('log', 'Log event emitted!');
}, 2000);