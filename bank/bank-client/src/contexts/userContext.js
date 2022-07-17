import React from 'react';

/**
 * Contains saved user context data for the app.
 */
const userContext = React.createContext({
    user: {},
    setUser: (user) => user
});

export default userContext;