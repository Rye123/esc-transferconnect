const express = require('express');
const router = express.Router();
const { check } = require("express-validator");

const bankControllers = require("../controllers/bank-controllers");

/* Route for bank to request for transfer information */
// router.get("/get-transfer/:tid",bankControllers.getTransferById);
router.post("/accrual-update",
    [
    check("referenceNumber").isAlphanumeric(),
    check("partnerCode").isAlphanumeric()
    ],
    bankControllers.getTransferByRef);

/* Route for bank to send transfer data */
router.post("/accrual-req",bankControllers.createTransfer);

module.exports = router;