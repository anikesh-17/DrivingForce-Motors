const config = require("../config/salesforce");
const {
    getSalesforceToken,
} = require("./salesforceAuthService");

async function querySalesforce(soql) {
    const tokenData = getSalesforceToken();

    if (!tokenData) {
        throw new Error(
            "Salesforce is not authenticated. Visit /api/auth/salesforce first."
        );
    }

    const url = new URL("/services/data/v67.0/query", tokenData.instance_url);

    url.searchParams.set("q", soql);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
            Accept: "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data[0]?.message ||
            data.message ||
            "Salesforce API request failed"
        );
    }

    return data;
}

module.exports = {
    querySalesforce,
};