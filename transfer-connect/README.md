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
- Can receive transfer requests and store them inside a javascript array. (**Use Case #3**: Verify accrual data received from Banks. Note: Verification can be done on Bank Backend side)
- Can request for transfer request information (**Use Case #4:** Return status of transaction until its completion.)

For more details on how to access these functionalities, look at examples at `tests/test.rest`

## Future Functionality
- Use Case 1
    - Allow bank to request for Loyalty program information
- Use Case 3
    - Store transfer requests in a MongoDB database
- Use Case 4 
    - Use better authentication for requesting transfer request information by bank
- Use Case 5
    - Return webhook to bank when transfer completed
- Use Case 7
    - Save data into databases
    
Note: Use case 2 and 6 can be better done by bank backend side
