# bank

## Organisation

`bank-client` contains the front-end code for the simulated banking company. There can be multiple instances of `bank-client` open, all connecting to a central `bank-server` instance.

`bank-server` contains the server-side code for the banking company.

## Installation
Follow the installation instructions in [`bank-server`](bank-server/README.md) and [`bank-client`](bank-client/README.md).

## Usage

In two separate terminals, run `npm start` in `bank-server` and in `bank-client`. Your browser should automatically to [http://localhost:3000](http://localhost:3000), otherwise click the link.