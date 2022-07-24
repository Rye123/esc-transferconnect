const ApplicationError = require('./ApplicationError');

/**
 * InvalidTransferError: Transfer Status given is invalid.
 * Status: 400 Bad Request
 */
class InvalidTransferError extends ApplicationError {
    constructor(message) {
        super(message || "Invalid transfer status.", 400);
    }
}

module.exports = InvalidTransferError;