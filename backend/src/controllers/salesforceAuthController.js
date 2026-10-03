const {
    getAuthorizationUrl,
    exchangeCodeForToken,
} = require("../services/salesforceAuthService");

const startSalesforceAuth = (req, res) => {
    const authorizationUrl = getAuthorizationUrl();

    res.redirect(authorizationUrl);
};

const salesforceCallback = async (req, res) => {
    try {
        const { code, state, error, error_description } = req.query;

        if (error) {
            return res.status(400).json({
                success: false,
                error,
                message: error_description,
            });
        }

        if (!code || !state) {
            return res.status(400).json({
                success: false,
                message: "Missing authorization code or state",
            });
        }

        const tokenData = await exchangeCodeForToken(code, state);

        res.json({
            success: true,
            message: "Salesforce authentication successful",
            instanceUrl: tokenData.instance_url,
            tokenType: tokenData.token_type,
        });
    } catch (error) {
        console.error("Salesforce OAuth error:", error);

        res.status(500).json({
            success: false,
            message: "Salesforce authentication failed",
            error: error.message,
        });
    }
};

module.exports = {
    startSalesforceAuth,
    salesforceCallback,
};