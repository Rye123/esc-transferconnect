const ApplicationError = require('./ApplicationError');

/**
 * ExternalAuthenticationError: External service has not been authenticated.
 * Status: 401 Unauthorised
 */
class ExternalAuthenticationError extends ApplicationError {
    constructor(message) {
        super(message || "Authentication failed.", 401);
    }
}

module.exports = ExternalAuthenticationError;