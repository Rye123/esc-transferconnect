const express = require('express');
const router = express.Router();

const bankControllers = require("../controllers/bank-controllers");
const loyaltyControllers = require("../controllers/loyalty-controllers");

/* Route for bank to request for transfer information */
router.get("/get-transfer/:tid",bankControllers.getTransferById);

/* Route for bank to request for loyalty program information. pid stands for Program ID (e.g. GOPOINTS) */
router.get("/get-loyalty-data/:pid",loyaltyControllers.getLoyaltyByProgramId);

/* Route for bank to send transfer data */
router.post("/send-transfer",bankControllers.createTransfer);

module.exports = router;