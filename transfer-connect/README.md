# transfer-connect

This contains the code for the Transfer-Connect API.

To set up, simply run:

### `npm install`

This will install all necessary dependencies into a `node_modules` directory.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server in the development mode.\
Open [http://localhost:3002](http://localhost:3002) to view it in your browser.

The page will reload when you make changes.

### `npm install ssh2-sftp-client@^8.0.0`

This will specifically install ssh2 dependencies for the SFTP client into the `node_modules` directory for testing purposes.

## Current Functionality
- Can request for Program information (**Use Case #1** Allow bank to request for Loyalty program information)
- Can validate if Loyalty Points ID is of the right format given the Program ID (**Use Case 2**: Validate if Bank User is a correct format given one of the listed loyalty programs)
- Can receive transfer requests and store them inside a MongoDB database. (**Use Case #3**: Verify accrual data received from Banks.)
- Can request for transfer request information (**Use Case #4:** Return status of transaction until its completion.)
- Use authentication for requesting transfer request information by bank (**Use Case #1, #2, #3, #4**)
- Implement connection from backend to SFTP server mimicking the Loyalty Program server (**Use Case 5**)

For more details on how to access these functionalities, look at examples at `tests/test.rest`

## Future Functionality
- Use Case 3
    - Send transfer data into bank-specific folder in sftp
- Use Case 4
    - Update accrual Request Route
        - Take in accrual Request ID and search accordingly, instead of document ID
        - Ensure uniqueness of accrual Request IDs
- Use Case 5
    - Poll SFTP server for data
    - Return webhook to bank when transfer completed