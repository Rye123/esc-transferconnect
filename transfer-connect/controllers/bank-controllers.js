const HttpError = require("../models/http-error.js");
const uuid = require("uuid");

let DUMMY_TRANSFERS = [
    {
        tid: "exampleid",
        username: "asdf",
        membership: "1005485",
        transfer: 100
    }
]

const getTransferById = (req, res, next) => {
    const transferId = req.params.tid;
    const transfer = DUMMY_TRANSFERS.find(t => {
        return t.tid === transferId;
    });

    if (!transfer) {
        //throw error
        throw new HttpError('Could not find a transfer for the provided id', 404);
    }

    res.json({transfer});
}

const createTransfer = (req, res, next) => {
    const {username, membership, transfer} = req.body;
    const createdTransfer = {
        tid: uuid.v4(),
        username,
        membership,
        transfer
    }

    DUMMY_TRANSFERS.push(createdTransfer);

    res.status(201).json({transfer: createdTransfer});
}

exports.getTransferById = getTransferById;
exports.createTransfer = createTransfer;