# bank-server

This contains the code for the banking company server.

## Installation

```bash
npm install
```

This will install all necessary dependencies into a `node_modules` directory.

```bash
npm install --only=dev
```

This will install the development dependencies like `nodemon`.

### Environment File Setup

`bank-server` relies on a `.env` file for secrets. **For project submission, the `.env` file is already provided in the report.**

Otherwise, the following are instructions to generate a custom `.env` file.

#### `JWT_TOKEN_SECRET`

The secret private key for the generation of a unique JWT token.

Run `node`, and in the given shell, generate a $64$-byte secret key for the JSON Web Token:

```js
> require('crypto').randomBytes(64).toString('hex')
```

Save that token in a `.env` file in this directory as `JWT_TOKEN_SECRET`. 

#### `MONGODB_URI`
The URL for the MongoDB Atlas instance.

## Usage

In the project directory, you can run:

```bash
npm start
```

This runs the app in development mode. The page will reload when you make changes.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.
