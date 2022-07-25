# tests

This contains the code for end-to-end testing of the Bank system. 

The purpose of this is to automatically set up the bank system for any testing to occur, instead of manually running both instances. Any future tests can also be easily added and run at once.

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

`testing` relies on a `.env` file for secrets. 

```
MONGODB_BANK_DB=bank-server-db
MONGODB_TEST_DB=${DB name for the test database}
MONGODB_MAIN_URI=${URI to the MongoDB instance}
```

## Usage

In the project directory, you can run:

```bash
npm start
```

This will:
1. Start an instance of `bank-server` on port 3001.
2. Start an instance of `bank-client` on port 3000.
3. Restore the database in `MONGODB_TEST_DB`, using the backup stored in `/tests/backup`.
4. Run the tests, shown in `index.js`.
5. Upon completion of the tests, restore the database to its initial state (i.e. repeating Step 3).
6. Kill the processes of `bank-server` and `bank-client`.
7. Exit.

## Defining new tests

A new test can be defined following the format shown in `testLoginLogout.js`, replacing the `testLogin()` and `testLogout()` with necessary test functions and adding them to the `try-catch` block in the `runTest` function.

Then, `require` the test under the `PREPARE FOR TESTING` line in `index.js`, and call `await ${your test}` in the `try-catch` block of `InitTests()`.