const {
    createSalesforceRecord,
} = require("../services/salesforceService");

const createTestDrive = async (req, res) => {
    try {
        const {
            vehicleId,
            customerName,
            phone,
            email,
            testDriveDate,
            preferredTime,
            notes,
        } = req.body;

        // Basic validation
        if (
            !vehicleId ||
            !customerName ||
            !phone ||
            !email ||
            !testDriveDate ||
            !preferredTime
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required test drive details.",
            });
        }

        const testDriveData = {
            Vehicle__c: vehicleId,
            Customer_Name__c: customerName,
            Phone__c: phone,
            Email__c: email,
            Test_Drive_Date__c: testDriveDate,
            Preferred_Time__c: preferredTime,
            Notes__c: notes || "",
            Status__c: "Requested",
        };

        const result = await createSalesforceRecord(
            "Test_Drive__c",
            testDriveData
        );

        res.status(201).json({
            success: true,
            message: "Test drive request created successfully.",
            data: {
                id: result.id,
                success: result.success,
            },
        });
    } catch (error) {
        console.error("Salesforce test drive creation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create test drive request.",
            error: error.message,
        });
    }
};

module.exports = {
    createTestDrive,
};