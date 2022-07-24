var newman = require('newman'); // require Newman in your project
const path = require('path');
let envPath = path.resolve(__dirname, 'tc_test.postman_environment.json');

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./TransferConnect.postman_collection.json'),
    reporters: 'cli',
    environment: envPath
}, function (err) {
    if (err) { throw err; }
    console.log('Collection run complete!');
});