/* Local Module Imports */
let Client = require('ssh2-sftp-client');
let csvToJson = require('convert-csv-to-json');
const { writeFile } = require('node:fs/promises');
const { Parser } = require('json2csv');
const json2csvParser = new Parser({ quote: '' });

/* User Defined functions*/
const sftp = require('./sftp');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const statusArray = ['0000','0001','0000','0002','0000','0003','0000','0004','0000','0005','0000','0099'];

const readCSVfile = async (filename) => {
    return csvToJson.fieldDelimiter(',').getJsonFromCsv(filename);
}

const createHandbackFile = async (filename, transfersJSON) => {
    const opts = {fields: ["Bank","Amount","ReferenceNumber","OutcomeCode"]};
    handbackJSON = [];
    // console.log("in create handback, json file is:", transfersJSON)
    for (const transfer of transfersJSON) {
        // console.log(transfer);
        newRow = {
            Bank: transfer['"partnerCode"'].replace(/(^"|"$)/g, ''),
            Amount: transfer['"amount"'].replace(/(^"|"$)/g, ''),
            ReferenceNumber: transfer['"referenceNumber"'].replace(/(^"|"$)/g, ''),
            OutcomeCode: statusArray[getRandomInt(statusArray.length)]
            // OutcomeCode: 0000
        }
        handbackJSON.push(newRow)
    }

    // console.log("handbackJSON is",handbackJSON);
    transferCSV = json2csvParser.parse(handbackJSON, opts);

    try {
        // console.log(`output location is ${filename}`)
        const response = await writeFile(filename, transferCSV);
        return response;
    } catch (error) {
        console.log(`Error ${error.message}`);
    }
}

const sendToSFTP = async (client, program) => {
    try {
        await client.uploadFile(`./sftp/${program}_HANDBACK.csv`, `./${program}/${program}_HANDBACK.csv`);
        console.log(`uploaded ${program}_HANDBACK file!`);
    } catch (err) {
        console.log(err);
    }
}

const sendHandbackFiles = async (loyaltyPrograms) => {
    // read file for each Loyalty Program    
    // for each file, createa handback csv file (save it in the sftp folder)
    // send the handback file to sftp
    console.log("Begin CRON JOB 2: Upload Handback file onto SFTP on Loyalty Program's behalf\n")
    config = {
        host: process.env.SFTP_HOST,
        port: process.env.SFTP_PORT,
        username: process.env.SFTP_USERNAME,
        password: process.env.SFTP_PASSWORD,
    };
    const client = new sftp.SFTPClient(config);
    await client.connect();

    try {
        console.log("START creating all handback files...")
        await Promise.all(loyaltyPrograms.map(async program => {
            transfersJSON = await readCSVfile(`./${program}.csv`);
            // console.log("made it past the read csv");
            // console.log(`./${program}.csv`,transfersJSON);
            await createHandbackFile(`./sftp/${program}_HANDBACK.csv`, transfersJSON);
            console.log(`Created ${program}_HANDBACK.csv`)
            // return message;
        }));
        console.log("FINISH creating all handback files\n")
    } catch (error) {
        console.log(`Error ${error.message}`);
    }

    console.log("START sending handback files to SFTP...")
    for (program of loyaltyPrograms) {
        await sendToSFTP(client, program);
        // message = `done uploading ${program} handback!`
        // console.log(message);
    }
    await client.disconnect();
    console.log("FINISH sending handback files to SFTP\n")
    console.log("Done with CRON JOB 2: Upload Handback file onto SFTP on Loyalty Program's behalf\n")
}

exports.sendHandbackFiles = sendHandbackFiles;