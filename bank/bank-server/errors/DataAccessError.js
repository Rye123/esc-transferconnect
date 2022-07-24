const ApplicationError = require('./ApplicationError');

/**
 * UserAuthenticationError: User has not been authenticated.
 * Status: 401 Unauthorised
 */
class DataAccessError extends ApplicationError {
    constructor(message) {
        super(message || "Data not found.", 404);
    }
}

module.exports = DataAccessError;