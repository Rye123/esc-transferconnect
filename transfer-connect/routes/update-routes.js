import axios from 'axios';
require("dotenv").config();

const UPDATE_URI = "http://localhost:3001/tc/updateTransferStatus";

const postTransferStatus = async(transferId, transferStatus, transferStatusMessage) => {
    try {
        const info = await axios.post(UPDATE_URI, {
            transferId: `${transferId}`,
            transferStatus: `${transferStatus}`,
            transferStatusMessage: `${transferStatusMessage}`
        }, { headers: {
            "Authorization": `Bearer ${process.env.AUTH_HEADER_BEARER}`
        }});
        console.log(info.data);
    } catch (err) {
        console.error(err);
    }
}

exports.postTransferStatus = postTransferStatus;