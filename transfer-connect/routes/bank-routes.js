const express = require('express');
const router = express.Router();

const bankControllers = require("../controllers/bank-controllers");

/* Route for bank to request for transfer information */
// router.get("/get-transfer/:tid",bankControllers.getTransferById);
router.post("/accrual-update",bankControllers.getTransferById);

/* Route for bank to send transfer data */
router.post("/accrual-req",bankControllers.createTransfer);

module.exports = router;