const { exec } = require('child_process');
require('dotenv').config();
const DB_URI = process.env.MONGODB_MAIN_URI;
const SRC_DB = process.env.MONGODB_BANK_DB;
const TGT_DB = process.env.MONGODB_TEST_DB;

console.log("Restoring Test Bank Database...")

exec(`mongorestore --uri ${DB_URI} --nsTo ${TGT_DB}.* --nsFrom ${SRC_DB}.* tests --drop`, (err, stdout, stderr) => {
    if (err) {
        // i.e. error executing, likely because it doesn't exist
        console.log(`ERROR: ${err.message}`);
        console.log("Please ensure you have mongorestore installed and that it is in your PATH, see https://www.mongodb.com/docs/database-tools/mongorestore/#installation");
        return;
    }

    if (stderr) {
        console.log(`${stderr}`);
        console.log("Restoration completed. If there was an error here, please complain to the guy that made me.");
        return;
    }

    console.log(`Standard Output: ${stdout}`);
    console.log("Restoration completed. If there was an error here, please complain to the guy that made me.");
});

