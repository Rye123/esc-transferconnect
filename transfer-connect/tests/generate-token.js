const jwt = require('jsonwebtoken');

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.JWT_TOKEN_SECRET_TC, { expiresIn: '1800s' });
  }
  
// console.log(process.env.SFTP_PASSWORD);
console.log(generateAccessToken({ userId: 'DBS' }))

// console.log(require('crypto').randomBytes(64).toString('hex'))