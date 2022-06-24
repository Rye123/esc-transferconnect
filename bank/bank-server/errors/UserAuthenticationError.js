const ApplicationError = require('./ApplicationError');

/**
 * UserAuthenticationError: User has not been authenticated.
 * Status: 401 Unauthorised
 */
class UserAuthenticationError extends ApplicationError {
    constructor (message) {
        super(message || "Authentication failed.", 401);
    }
}

module.exports = UserAuthenticationError;