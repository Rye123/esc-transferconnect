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

`bank-server` relies on a `.env` file for secrets. 

```
JWT_TOKEN_SECRET={Secret private key for generation of a unique JWT token}
MONGODB_URI={URL to MongoDB Atlas Instance, to the bank server database}
MONGODB_TEST_URI={URL to MongoDB Atlas Instance, to the TEST bank server database}
EMAIL_PASSWORD={Password for nodemailer email}
TC_TOKEN_SECRET={Token to be used for sending requests to the TransferConnect server}
TC_WEBHOOK_AUTH={Authorisation token to be used by TransferConnect when sending data to the webhook}
```

## Usage

In the project directory, you can run:

```bash
npm start
```

This runs the app in development mode. The page will reload when you make changes.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.
