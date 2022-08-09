const ApplicationError = require('./ApplicationError');

/**
 * InvalidTransferError: Transfer given is invalid.
 * Status: 400 Bad Request
 */
class InvalidTransferError extends ApplicationError {
    constructor(message) {
        super(message || "Invalid transfer.", 400);
    }
}

module.exports = InvalidTransferError;