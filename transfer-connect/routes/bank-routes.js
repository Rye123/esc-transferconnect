const express = require('express');
const router = express.Router();

const bankControllers = require("../controllers/bank-controllers");

router.get("/:tid",bankControllers.getTransferById);

router.post("/",bankControllers.createTransfer);

module.exports = router;