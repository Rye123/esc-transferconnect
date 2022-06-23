/**
 * JWT_Auth: Handler for JSON Web Token authentication
 */

const jwt = require('jsonwebtoken');

const JWT_Auth = {
    token_expiry_time: '1800s',
    cookie_name: 'jwt_token',

    /**
     * Returns a token to be saved as a cookie
     * @param {Object} payload 
     */
    generateToken (payload) {
        return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: this.token_expiry_time });
    },

    /**
     * Middleware that requires authentication to proceed.
     * If user is not authenticated (i.e. doesn't have a token or has an invalid one), response is a 401 or 403 error.
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    requireAuth (request, response, next) {
        const token = request.cookies[JWT_Auth.cookie_name]; // attempt to find the token
        if (token == null) // token doesn't exist!
            return response.status(401).send({ error: 'authentication required' });
        
        // token exists -- verify with JWT
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, payload) => {
            if (error)
                return response.status(401).send({ error: 'authentication required' });
    
            // here, the payload is verified. we save it as a new attribute in the request.
            request.payload = payload; 
            // console.log("JWT_Auth: Received token: ", token)
            // console.log("JWT_Auth: Received payload: ", payload);
            next(); // call the next function
        });
    }
};

module.exports = JWT_Auth;