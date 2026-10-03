const crypto = require("crypto");
const config = require("../config/salesforce");

let salesforceToken = null;

const pendingAuth = new Map();

function base64Url(buffer) {
    return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function createCodeVerifier() {
    return base64Url(crypto.randomBytes(32));
}

function createCodeChallenge(verifier) {
    return base64Url(
        crypto
            .createHash("sha256")
            .update(verifier)
            .digest()
    );
}

function createState() {
    return base64Url(crypto.randomBytes(32));
}

function getAuthorizationUrl() {
    const state = createState();
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);

    pendingAuth.set(state, {
        codeVerifier,
        createdAt: Date.now(),
    });

    const params = new URLSearchParams({
        response_type: "code",
        client_id: config.clientId,
        redirect_uri: config.callbackUrl,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });

    return `${config.loginUrl}/services/oauth2/authorize?${params.toString()}`;
}

async function exchangeCodeForToken(code, state) {
    const authData = pendingAuth.get(state);

    if (!authData) {
        throw new Error("Invalid or expired OAuth state");
    }

    pendingAuth.delete(state);

    const params = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        code_verifier: authData.codeVerifier,
    });

    const response = await fetch(
        `${config.loginUrl}/services/oauth2/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error_description ||
            data.error ||
            "Salesforce OAuth authentication failed"
        );
    }

    salesforceToken = data;

    return data;
}

function getSalesforceToken() {
    return salesforceToken;
}

module.exports = {
    getAuthorizationUrl,
    exchangeCodeForToken,
    getSalesforceToken,
};