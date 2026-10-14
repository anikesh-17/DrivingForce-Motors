const express = require("express");

const {
    createLead,
    getLeads,
    updateLeadStatus,
    getLeadFollowUps,
} = require("../controllers/leadController");

const router = express.Router();

router.get("/", getLeads);
router.patch("/:leadId/status", updateLeadStatus);
router.get("/:leadId/follow-ups", getLeadFollowUps);
router.post("/", createLead);

module.exports = router;
