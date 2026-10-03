const config = {
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    callbackUrl: process.env.SALESFORCE_CALLBACK_URL,
};

module.exports = config;