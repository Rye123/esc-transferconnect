# bank-server

This contains the code for the banking company server.

## Installation

```bash
npm install
```

This will install all necessary dependencies into a `node_modules` directory.

Next, run `node`, and in the given shell, generate a $64$-byte secret key for the JSON Web Tokenh:

```js
> require('crypto').randomBytes(64).toString('hex')
```

Save that token in a `.env` file in this directory as `JWT_TOKEN_SECRET`.

```
JWT_TOKEN_SECRET=<your generated token>
```

## Usage

In the project directory, you can run:

```bash
npm start
```

This runs the app in development mode. The page will reload when you make changes.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.