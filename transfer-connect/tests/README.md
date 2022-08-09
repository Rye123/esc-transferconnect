# Postman testing for transfer-connect

Newman is a command-line Collection Runner for Postman. It enables you to run and test a Postman Collection directly from the command line. It's built with extensibility in mind so that you can integrate it with your continuous integration servers and build systems.

Newman maintains feature parity with Postman and allows you to run collections the way they're executed inside the collection runner in Postman.

## To run the tests

- Split the terminal. 
- cd to the transfer-connect folder and run npm start. This is to ensure that the TransferConnect server is running.
- On the other half of the terminal, cd to the tests folder (inside transfer-connect) and type the command node tc_tests.js
- After all the tests are run, you should see 'Collection run complete' with the PASS and FAILED tests.

# Artilery testing for fuzzing

Artillery is a modern, powerful & easy-to-use performance testing toolkit. Specifically, we used the Artillery Fuzzer plugin. This plugin made it easy to run fuzz testing on our HTTP API with Artillery.

The plugin uses Artillery to send a lot of junk (unexpected and weird payloads) to our API endpoints. We can then monitor our backend for exceptions, errors or crashes, and improve the security and reliability of our system by fixing any issues uncovered.


## To run the tests

- Split the terminal. 
- cd to the transfer-connect folder and run npm start. This is to ensure that the TransferConnect server is running.
- On the other half of the terminal, cd to the tests folder and type the command
DEBUG=plugin:fuzzer artillery run \
    --variables '{ "token": <JWT_TOKEN_SECRET_TEST> }' \
    fuzzingTestTC.yaml

- To stop printing out the generated naughtyString variable used during the test run you can run the alternate command
artillery run \
    --variables '{ "token": <JWT_TOKEN_SECRET_TEST> }' \
    fuzzingTestTC.yaml

- After all the tests are run, you should see a summary report with the number of requests with success and failure(http codes: 200, 201, 404, 500).