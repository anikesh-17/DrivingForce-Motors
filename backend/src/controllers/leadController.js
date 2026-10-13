const {
    createSalesforceRecord,
} = require("../services/salesforceService");

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

module.exports = {
    createLead,
};
