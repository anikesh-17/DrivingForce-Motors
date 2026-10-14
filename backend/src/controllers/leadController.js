const {
    createSalesforceRecord,
    querySalesforce,
    updateSalesforceRecord,
} = require("../services/salesforceService");

const ALLOWED_LEAD_STATUSES = new Set([
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Closed",
]);

const createLead = async (req, res) => {
    try {
        const {
            customerName,
            email,
            phone,
            vehicleId,
            enquiryType,
            leadSource,
            status = "New",
            notes,
        } = req.body;

        if (
            !customerName ||
            !email ||
            !phone ||
            !vehicleId ||
            !enquiryType ||
            !leadSource
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required lead details.",
            });
        }

        const leadData = {
            Customer_Name__c: customerName,
            Email__c: email,
            Phone__c: phone,
            Vehicle__c: vehicleId,
            Enquiry_Type__c: enquiryType,
            Lead_Source__c: leadSource,
            Status__c: status,
            Notes__c: notes || "",
        };

        const result = await createSalesforceRecord(
            "DrivingForce_Lead__c",
            leadData
        );

        res.status(201).json({
            success: true,
            message: "Lead created successfully.",
            data: {
                id: result.id,
                success: result.success,
            },
        });
    } catch (error) {
        console.error("Salesforce lead creation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create lead.",
            error: error.message,
        });
    }
};

const getLeads = async (req, res) => {
    try {
        const soql = `
            SELECT Id, Name, Customer_Name__c, Email__c, Phone__c,
                   Vehicle__c, Vehicle__r.Name, Vehicle__r.Brand__c,
                   Vehicle__r.Model__c, Enquiry_Type__c, Lead_Source__c,
                   Status__c, Notes__c, CreatedDate
            FROM DrivingForce_Lead__c
            ORDER BY CreatedDate DESC
            LIMIT 100
        `;

        const result = await querySalesforce(soql);

        res.status(200).json({
            success: true,
            total: result.totalSize,
            data: result.records,
        });
    } catch (error) {
        console.error("Salesforce lead retrieval error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads from Salesforce.",
            error: error.message,
        });
    }
};

const updateLeadStatus = async (req, res) => {
    const { leadId } = req.params;
    const status = typeof req.body?.status === "string" ? req.body.status.trim() : "";

    if (!/^[a-zA-Z0-9]{15}(?:[a-zA-Z0-9]{3})?$/.test(leadId || "")) {
        return res.status(400).json({
            success: false,
            message: "A valid Salesforce lead ID is required.",
        });
    }

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "A non-empty lead status is required.",
        });
    }

    if (!ALLOWED_LEAD_STATUSES.has(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${[...ALLOWED_LEAD_STATUSES].join(", ")}.`,
        });
    }

    try {
        await updateSalesforceRecord("DrivingForce_Lead__c", leadId, {
            Status__c: status,
        });

        return res.status(200).json({
            success: true,
            message: "Lead status updated successfully.",
            data: { id: leadId, Status__c: status },
        });
    } catch (error) {
        console.error("Salesforce lead status update error:", error);
        const notAuthenticated = error.message?.includes("not authenticated");
        return res.status(notAuthenticated ? 503 : 502).json({
            success: false,
            message: notAuthenticated
                ? "Salesforce is not authenticated. Authenticate and try again."
                : "Failed to update lead status in Salesforce.",
        });
    }
};

const getLeadFollowUps = async (req, res) => {
    const { leadId } = req.params;

    if (!/^[a-zA-Z0-9]{15}(?:[a-zA-Z0-9]{3})?$/.test(leadId || "")) {
        return res.status(400).json({
            success: false,
            message: "A valid Salesforce lead ID is required.",
        });
    }

    try {
        const soql = `
            SELECT Id, Name, DrivingForce_Lead__c, Follow_Up_Date__c,
                   Status__c, Priority__c, Assigned_To__c,
                   Follow_Up_Type__c, Notes__c
            FROM Lead_Follow_Up__c
            WHERE DrivingForce_Lead__c = '${leadId}'
            ORDER BY Follow_Up_Date__c DESC NULLS LAST
            LIMIT 100
        `;

        const result = await querySalesforce(soql);

        return res.status(200).json({
            success: true,
            total: result.totalSize,
            data: result.records,
        });
    } catch (error) {
        console.error("Salesforce lead follow-up retrieval error:", error);
        const notAuthenticated = error.message?.includes("not authenticated");
        return res.status(notAuthenticated ? 503 : 502).json({
            success: false,
            message: notAuthenticated
                ? "Salesforce is not authenticated. Authenticate and try again."
                : "Failed to fetch follow-ups from Salesforce.",
        });
    }
};

module.exports = {
    createLead,
    getLeads,
    updateLeadStatus,
    getLeadFollowUps,
};
