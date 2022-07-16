var newman = require('newman'); // require Newman in your project

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./TransferConnect.postman_collection.json'),
    reporters: 'cli'
}, function (err) {
    if (err) { throw err; }
    console.log('Collection run complete!');
});