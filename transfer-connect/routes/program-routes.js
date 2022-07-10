const express = require('express');
const router = express.Router();

const programControllers = require("../controllers/program-controllers");

/* Route for bank to request for loyalty program information. pid stands for Program ID (e.g. GOPOINTS) */
router.get("/info/:pid",programControllers.getLoyaltyByProgramId);

/* Route for bank to request for validation of Loyalty Points ID data */
router.get("/validate/:pid/:lpid",programControllers.getLPIDValidation);

module.exports = router;