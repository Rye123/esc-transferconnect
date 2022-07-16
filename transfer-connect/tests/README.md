# Postman testing for transfer-connect

Newman is a command-line Collection Runner for Postman. It enables you to run and test a Postman Collection directly from the command line. It's built with extensibility in mind so that you can integrate it with your continuous integration servers and build systems.

Newman maintains feature parity with Postman and allows you to run collections the way they're executed inside the collection runner in Postman.

## To run the tests

- Split the terminal. 
- cd to the transfer-connect folder and run npm start. This is to ensure that the TransferConnect server is running.
- On the other half of the terminal, cd to the tests folder (inside transfer-connect) and type the command node tc_tests.js
- After all the tests are run, you should see 'Collection run complete' with the PASS and FAILED tests.