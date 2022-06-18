# bank-server

This contains the code for the banking company server.

To set up, simply run:

### `npm install`

This will install all necessary dependencies into a `node_modules` directory.

Then, generate a $64$-byte secret key for the JSON Web Token with:

```js
require('crypto').randomBytes(64).toString('hex')
```

And save that in a `.env` file in this directory as `JWT_TOKEN_SECRET`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.