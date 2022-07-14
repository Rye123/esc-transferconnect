// 1) Paste this code into a new file (sftp.js)
//
// 2) Install dependencies
//   npm install ssh2-sftp-client@^8.0.0
//
// 3) Run the script
//   node sftp.js

let Client = require('ssh2-sftp-client');
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
    console.log(`Uploading ${localFile} to ${remoteFile} ...`);
    try {
      await this.client.put(localFile, remoteFile);
    } catch (err) {
      console.error('Uploading failed:', err);
    }
  }

  // download files from remote directory to local directory
  async downloadFile(remoteFile, localFile) {
    console.log(`Downloading ${remoteFile} to ${localFile} ...`);
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

// test case, will be worked on soon further
(async () => {
  config = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  }
  const client = new SFTPClient(config);

  //* Open the connection
  await client.connect();

  //* List working directory files
  await client.listFiles(".");

  //* Upload local file to remote file
  await client.uploadFile("./local.txt", "./remote.txt");

  //* Download remote file to local file
  await client.downloadFile("./remote.txt", "./download.txt");

  //* Make remote directory
  await client.makeDirectory("./test_dir");

  //* Delete remote directory
  await client.removeDirectory("./test_dir");

  //* Delete remote file
  await client.deleteFile("./remote.txt");

  //* Close the connection
  await client.disconnect();
})();

module.exports = SFTPClient;