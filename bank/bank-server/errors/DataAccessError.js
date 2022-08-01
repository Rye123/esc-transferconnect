const ApplicationError = require('./ApplicationError');

/**
 * DataAccessError: Given data could not be accessed.
 * Status: 404 Not Found.
 */
class DataAccessError extends ApplicationError {
    constructor(message) {
        super(message || "Data not found.", 404);
    }
}

module.exports = DataAccessError;