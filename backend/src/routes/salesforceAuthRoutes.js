const express = require("express");

const {
    startSalesforceAuth,
    salesforceCallback,
} = require("../controllers/salesforceAuthController");

const router = express.Router();

router.get("/salesforce", startSalesforceAuth);

router.get("/salesforce/callback", salesforceCallback);

module.exports = router;