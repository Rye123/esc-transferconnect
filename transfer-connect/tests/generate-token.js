const jwt = require('jsonwebtoken');

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function generateAccessToken(bankName) {
    return jwt.sign(bankName, process.env.JWT_TOKEN_SECRET_TC);
  }
  
// console.log(process.env.SFTP_PASSWORD);
console.log(generateAccessToken({ bankName: 'POSB' }))

// console.log(require('crypto').randomBytes(64).toString('hex'))