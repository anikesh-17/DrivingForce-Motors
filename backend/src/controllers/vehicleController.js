const { querySalesforce } = require("../services/salesforceService");

const getVehicles = async (req, res) => {
    try {
        const soql = `
            SELECT
                Id,
                Name,
                Brand__c,
                Model__c,
                Variant__c,
                Vehicle_Type__c,
                Fuel_Type__c,
                Transmission__c,
                Price__c,
                Model_Year__c,
                Mileage__c,
                Seating_Capacity__c,
                Color__c,
                Description__c,
                Availability_Status__c,
                Primary_Image_URL__c
            FROM Vehicle__c
            ORDER BY CreatedDate DESC
        `;

        const result = await querySalesforce(soql);

        res.json({
            success: true,
            count: result.totalSize,
            data: result.records,
        });
    } catch (error) {
        console.error("Salesforce vehicle query error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicles from Salesforce",
            error: error.message,
        });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        const soql = `
            SELECT
                Id,
                Name,
                Brand__c,
                Model__c,
                Variant__c,
                Vehicle_Type__c,
                Fuel_Type__c,
                Transmission__c,
                Price__c,
                Model_Year__c,
                Mileage__c,
                Seating_Capacity__c,
                Color__c,
                Description__c,
                Availability_Status__c,
                Primary_Image_URL__c
            FROM Vehicle__c
            WHERE Id = '${id}'
            LIMIT 1
        `;

        const result = await querySalesforce(soql);

        if (result.totalSize === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            data: result.records[0],
        });
    } catch (error) {
        console.error("Salesforce vehicle query error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle from Salesforce",
            error: error.message,
        });
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
};