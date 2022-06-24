const ApplicationError = require('./ApplicationError');

/**
 * UserAuthorisationError: User is not authorised to do this.
 * Status: 403 Forbidden
 */
class UserAuthorisationError extends ApplicationError {
    constructor (message) {
        super(message || "User unauthorised.", 403);
    }
}

module.exports = UserAuthorisationError;