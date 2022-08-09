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

Further, the following services are necessary:
- A [MongoDB Atlas](https://www.mongodb.com/atlas/database) instance to host the bank server database.
- A [Nodemailer](https://nodemailer.com/about/) account, to allow the bank server to send emails to update users.
- A pair of [VAPID](https://web.dev/push-notifications-web-push-protocol/) keys as part of the Web Push Protocol, to allow the bank server to send web push notifications to users.
- A [Twilio](https://www.twilio.com/) account, to allow the bank server to send SMSes to update users.

### Environment File Setup

`bank-server` relies on a `.env` file for secrets. 

```
# Secret for JWT authentication
JWT_TOKEN_SECRET={Token for JWT authentication}

# MongoDB URIs and details
MONGODB_URI={URL to MongoDB Atlas Instance, to the bank server database}
MONGODB_TEST_URI={URL to MongoDB Atlas Instance, to the TEST bank server database}

# Notifications
## Nodemailer Password
EMAIL_PASSWORD={Password for nodemailer email}
## VAPID Keys for Push Notifications
VAPID_PUB_KEY={Public key for VAPID}
VAPID_PRIV_KEY={Private key for VAPID}
## Twilio Details
TWILIO_ACCOUNT_SID={Twilio Account SID}
TWILIO_AUTH_TOKEN={Twilio Auth Token}
TWILIO_NUMBER={Twilio Phone Number}

# Details for TransferConnect
TC_TOKEN_SECRET={Token to be used for sending requests to the TransferConnect server}
TC_WEBHOOK_AUTH={Secret private key for generation of a unique JWT token}
```

- A secret key is used to generate a JWT token.
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) is used to host the database for the bank server. Two databases are used -- one that hosts the default database, and one that hosts the test database used when `npm run test` is called. The URIs to these databases along with the relevant user and password are stored as environment variables as shown above.
- For sending transfer completion notifications to users, we allow for notifications to be sent via email, web push notifications and via SMSes. These are done using [Nodemailer](https://nodemailer.com/about/), the [Web Push Protocol](https://web.dev/push-notifications-web-push-protocol/) and [Twilio](https://www.twilio.com/) respectively, with the details stored as environment variables as shown above.
- For integration with [TransferConnect](https://github.com/Rye123/esc-transferconnect/tree/main/transfer-connect) two URLs are provided -- the first is a shared secret with TransferConnect to authenticate requests from the bank to TransferConnect. The second is a shared secret with TransferConnect to authenticate requests coming from TransferConnect to a bank-hosted webhook.

## Usage

In the project directory, you can run:

```bash
npm start
```

This runs the app in development mode. The server will reload when you make changes.\

Alternatively, to run in testing mode and use the **test** database, run:

```bash
npm run test
```
