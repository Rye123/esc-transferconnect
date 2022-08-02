import axios from 'axios';
require("dotenv").config();

const UPDATE_URI = "http://localhost:3001/tc/updateTransferStatus";

const postTransferStatus = async(transferId, transferStatus, transferStatusMessage) => {
    axios.post(UPDATE_URI, {
        transferId: `${transferId}`,
        transferStatus: `${transferStatus}`,
        transferStatusMessage: `${transferStatusMessage}`
    }, { headers: {
        "Authorization": `Bearer ${process.env.AUTH_HEADER_BEARER}`
    }},)
    .then((response) => {
        console.log(response);
    });
}

exports.postTransferStatus = postTransferStatus;