const express = require('express');
const router = express.Router();

const bankControllers = require("../controllers/bank-controllers");

router.get("/get-transfer/:tid",bankControllers.getTransferById);

router.get("/get-loyalty-data/:lid",);

router.post("/send-transfer",bankControllers.createTransfer);

module.exports = router;