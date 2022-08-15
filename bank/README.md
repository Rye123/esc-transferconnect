# bank

## Organisation

`bank-client` contains the front-end code for the simulated banking company. There can be multiple instances of `bank-client` open, all connecting to a central `bank-server` instance.

`bank-server` contains the server-side code for the banking company.

## Installation
Follow the installation instructions in [`bank-server`](bank-server/README.md) and [`bank-client`](bank-client/README.md).

## Usage

In two separate terminals, run `npm start` in `bank-server` and in `bank-client`. Your browser should automatically go to [http://localhost:3000](http://localhost:3000), otherwise click the link.

## Current Functionality
- JWT Authentication, with users from a MongoDB Atlas database.
- User Notification through email, push notifications and phone number SMSes.
- Security
  - SHA256 hashing of passwords
- Views
  - Routing to allow the views as described in the [Bank Client State Diagram](https://github.com/Rye123/esc-transferconnect/blob/main/diagrams/bank/Bank%20Client%20State%20Diagram.png).
  - Functionality to support the above views.
- Communication with TransferConnect

## Future Functionality
- Security
  - HTTPS to prevent MITM attacks on authentication
