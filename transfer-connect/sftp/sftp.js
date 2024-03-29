/* Local Module Imports */
let Client = require('ssh2-sftp-client');
const { parse } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');
const { writeFile } = require('node:fs/promises');
const { open } = require('node:fs/promises'); 
const axios = require('axios');
// const { createReadStream } = require('node:fs');
// const fs = require('fs').promises;
const createReadStream = require('fs').createReadStream;

/* User Defined functions*/
const HttpError = require('../models/http-error');
const Transfer = require("../models/transfer");
const transfer = require('../models/transfer');
const { connect } = require('http2');
const { collection } = require('../models/transfer');

require("dotenv").config();
class SFTPClient {
  constructor(config) {
    this.client = new Client();
    this.config = config;
  }

  // connect to SFTP server
  async connect() {
    console.log(`Connecting to ${this.config.host}:${this.config.port}`);
    try {
      await this.client.connect(this.config);
    } catch (err) {
      console.log('Failed to connect:', err);
    }
  }

  // disconnect from SFTP server
  async disconnect() {
    await this.client.end();
    console.log(`Disconnected from sftp server`);
  }

  // list available files in the remote directory
  async listFiles(remoteDir, fileGlob) {
    console.log(`Listing ${remoteDir} ...`);
    let fileObjects;
    try {
      fileObjects = await this.client.list(remoteDir, fileGlob);
    } catch (err) {
      console.log('Listing failed:', err);
    }

    const fileNames = [];

    for (const file of fileObjects) {
      if (file.type === 'd') {
        console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
      } else {
        console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
      }

      fileNames.push(file.name);
    }

    return fileNames;
  }

  // upload files from local directory to remote directory
  async uploadFile(localFile, remoteFile) {
    // console.log(`Uploading ${localFile} to ${remoteFile} ...`);
    return this.client.put(localFile, remoteFile);
  }

  // download files from remote directory to local directory
  async downloadFile(remoteFile, localFile) {
    // console.log(`Downloading ${remoteFile} to ${localFile} ...`);
    try {
      await this.client.get(remoteFile, localFile);
    } catch (err) {
      console.error('Downloading failed:', err);
    }
  }

  // create new directory in path
  async makeDirectory(remoteDir) {
    console.log(`Creating new directory ${remoteDir}`)
    try {
      await this.client.mkdir(remoteDir, true);
    } catch (err) {
      console.error('Creation failed:', err);
    }
  }

  // delete new directory in path
  async removeDirectory(remoteDir) {
    console.log(`Deleting directory ${remoteDir}`)
    try {
      await this.client.rmdir(remoteDir, true);
    } catch (err) {
      console.error('Creation failed:', err);
    }
  }

  // delete files from remote directory
  async deleteFile(remoteFile) {
    console.log(`Deleting ${remoteFile}`);
    try {
      await this.client.delete(remoteFile);
    } catch (err) {
      console.error('Deleting failed:', err);
    }
  }
}

const sendDailyTransfers = async (loyaltyPrograms) => {
    console.log("Begin CRON JOB 1: Send Daily Transfers to SFTP server\n")
    let transfers;
    let transferCSV;
    const opts = {fields: ['memberId','amount','referenceNumber','partnerCode','status']};

    // SFTP setup
    config = {
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    }
    const client = new SFTPClient(config);

    // for each program, get all processing documents from mongodb
    console.log(`START getting program data from MongoDB and writing to CSV...`)
    await Promise.all(loyaltyPrograms.map(async program => {
      
      try {
        // console.log(`Getting ${program} data from mongo...`);
        transfers = await Transfer.find({status: "processing", 
                                        loyaltyProgram: program,
                                        sentToSFTP: "false"});
        transferCSV = parse(transfers, opts);
        
        // save csv file
        // console.log(`Writing ${program} data from local file...`);
        const response = await writeFile(`${program}.csv`, transferCSV);
        console.log(`Write to ${program}.csv successfully!`);
        return response;
      } catch (error) {
        console.log(`Error ${error.message}`);
      }
      
    }));
    console.log(`FINISH getting program data from mongo and writing to CSV\n`)
    console.log(`START uploading all CSV to SFTP server...`)
    //* Open the connection
    await client.connect();
    for (const program of loyaltyPrograms) {
      try {
        await client.uploadFile(`./${program}.csv`, `./${program}/${program}.csv`);
        console.log(`uploaded ${program} file!`);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(`FINISH uploading all CSV to SFTP server\n`)
    
    //* Close the connection
    // await client.uploadFile(`./transfers.csv`, `./transfers.csv`);
    // console.log("closing now");
    await client.disconnect();

    console.log(`\nSTART updating program data in MongoDB...`)
    await Promise.all(loyaltyPrograms.map(async program => {
      
      try {
        // console.log(`Getting ${program} data from mongo...`);
        transfers = await Transfer.updateMany({status: "processing", 
                                        loyaltyProgram: program,
                                        sentToSFTP: "false"},
                                        { $set: {
                                          sentToSFTP: "true"} });

        console.log(`Updated for ${program} in MongoDB successfully!`);
      } catch (error) {
        console.log(`Error ${error.message}`);
      }
      
    }));
    // await client.uploadFile("./transfers.csv", "./remoteTransfer.csv");
    console.log(`FINISH updating program data in MongoDB\n`)
    console.log(`Done with CRON JOB 1: Send Daily Transfers to SFTP server\n`)
}

const postTransferStatus = async(transferId, transferStatus, transferStatusMessage) => {
    const UPDATE_URI = "http://localhost:3001/api/tc/updateTransferStatus";
    try {
        const info = await axios.post(UPDATE_URI, {
            transferId: `${transferId}`,
            transferStatus: `${transferStatus}`,
            transferStatusMessage: `${transferStatusMessage}`
        }, { headers: {
            "Authorization": `${process.env.JWT_TOKEN_SECRET_TC_TO_BANK}`
        }});
        // console.log(info.data);
    } catch (err) {
        console.error(err.response.status);
    }
}

const updateTransactionStatus = async (loyaltyPrograms) => {
  const codeToMessage = {'0000': "success",
                       '0001': "member not found",
                       '0002' : "member name mismatch",
                       '0003' : "member account closed",
                       '0004' : "member account suspended",
                       '0005' : "member ineligible for accrual",
                       '0099' : "unable to process, please contact support for more information"};

  const codeToStatus = {'0000': "completed",
                        '0001': "error",
                        '0002' : "error",
                        '0003' : "error",
                        '0004' : "error",
                        '0005' : "error",
                        '0099' : "error"};

  console.log(`START update Mongo Document & send post request to bank for each transfer in Handback...`)
  const promise = Promise.all(loyaltyPrograms.map(async program => {
    // console.log(`inside map function of ${program}`);
    try {
      const fd = await open(`./${program}_HANDBACK.csv`);
      fd.createReadStream(`./${program}_HANDBACK.csv`).pipe(csv())
      .on("data", async (row) => {
        // console.log(`start reading a row in ${program} file`);
        try {
          // console.log(`sending details for ${row['ReferenceNumber']}`)
          
          //update Mongo Document
          const filter = {loyaltyProgram: program, referenceNumber: row['ReferenceNumber']};
          const updateDoc = { $set: {status: codeToStatus[row['OutcomeCode']],
                                     outcomeDetails: codeToMessage[row['OutcomeCode']]} };
          // console.log(`${program}`,filter);
          // console.log(`${program}`,updateDoc);
          // const aTransfer = await Transfer.find(filter);
          // console.log(aTransfer);
          const mongoUpdate = Transfer.updateOne(filter, updateDoc);
    
          //send postRequest to Bank
          const sendEmail = postTransferStatus(row['ReferenceNumber'],
                                   codeToStatus[row['OutcomeCode']],
                                   codeToMessage[row['OutcomeCode']]);
          
          const promise = Promise.all([mongoUpdate,sendEmail]);
          console.log(`updated and sent notif for ${row['ReferenceNumber']} in ${program}!`);
          return promise;
    
        } catch (error) {
          console.log(`Error ${error.message}`);
        }  
      });
      return fd;
    } catch (error) {
      console.log(`Error ${error.message}`);
    }  
  }));
  return promise;
}

const updateDailyTransfers = async (loyaltyPrograms) => {
  // SFTP setup
  config = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  };
  const client = new SFTPClient(config);

  await client.connect();

  //theoretically, for each bank
  //assume that all sftp server folders have updated by now as well
  console.log('\nSTART download Handback file for each loyalty Program...')
  for (program of loyaltyPrograms) {
    // console.log(`pulling ${program} file from sftp...`)
    await client.downloadFile(`./${program}/${program}_HANDBACK.csv`, `./${program}_HANDBACK.csv`);
    console.log(`pulling ${program} file from sftp COMPLETE`)
  }
  console.log('FINISH download Handback file for each loyalty Program\n')
  // (async () => await getResult())()
  // async () => await updateTransactionStatus(loyaltyPrograms)();
  await updateTransactionStatus(loyaltyPrograms);

  await client.disconnect();
  console.log(`FINISH update Mongo Document & send post request to bank for each transfer in Handback\n`)

  //for each entry in the excel:
  //send it into the update function (above is done within updateTransactionStatus)
}

// test case, will be worked on soon further
// (async () => {
//   config = {
//     host: process.env.SFTP_HOST,
//     port: process.env.SFTP_PORT,
//     username: process.env.SFTP_USERNAME,
//     password: process.env.SFTP_PASSWORD,
//   }
//   const client = new SFTPClient(config);

//   //* Open the connection
//   await client.connect();

//   //* List working directory files
//   await client.listFiles(`.`);

//   //* Upload local file to remote file
//   // await client.uploadFile(`./local.txt`, `./remote.txt`);

//   // //* Download remote file to local file
//   // await client.downloadFile("./remote.txt", "./download.txt");

//   // //* Make remote directory
//   // await client.makeDirectory("./test_dir");

//   // //* Delete remote directory
//   // await client.removeDirectory("./test_dir");

//   // //* Delete remote file
//   // await client.deleteFile(`./remote.txt`);

//   //* Close the connection
//   await client.disconnect();
// })();

exports.SFTPClient = SFTPClient;
exports.sendDailyTransfers = sendDailyTransfers;
exports.updateDailyTransfers = updateDailyTransfers;