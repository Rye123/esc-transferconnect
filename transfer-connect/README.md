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

## Current Functionality
- Can receive transfer requests and store them inside a MongoDB database. (**Use Case #3**: Verify accrual data received from Banks.)
- Can request for transfer request information (**Use Case #4:** Return status of transaction until its completion.)
- Can request for Program information (**Use Case #1** Allow bank to request for Loyalty program information)
- Can validate if Loyalty Points ID is of the right format given the Program ID (**Use Case 2**: Validate if Bank User is a correct format given one of the listed loyalty programs)

For more details on how to access these functionalities, look at examples at `tests/test.rest`

## Future Functionality
- Use Case 1, 5
    - Implement connection from backend to SFTP server mimicking the Loyalty Program server
- Use Case 4 
    - Use authentication for requesting transfer request information by bank
- Use Case 5
    - Return webhook to bank when transfer completed
