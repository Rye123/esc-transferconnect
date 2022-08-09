const ApplicationError = require('./ApplicationError');

/**
 * TransferConnectError: Error occurred with TransferConnect side.
 * Status: -
 */
class TransferConnectError extends ApplicationError {
    constructor(message) {
        super(message || "TransferConnect Error", -1);
    }
}

module.exports = TransferConnectError;