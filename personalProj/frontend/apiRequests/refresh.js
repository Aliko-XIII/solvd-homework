/**
 * Extracts the header from a JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded header
 */
function getTokenHeader(token) {
    const headerEncoded = token.split('.')[0];
    const headerDecoded = atob(headerEncoded);
    const header = JSON.parse(headerDecoded);
    return header;
}

function getTokenPayload(token) {
    const payloadEncoded = token.split('.')[1];
    const payloadDecoded = atob(payloadEncoded);
    const payload = JSON.parse(payloadDecoded);
    return payload;
}

/**
 * Checks if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if the token is expired, false otherwise
 */
function isExpired(token) {
    const { iat, exp } = getTokenHeader(token);
    const issuedAt = new Date(iat);
    const expNumber = exp.replace(/[a-z]/g, '');
    const expMeasure = exp.replace(/[0-9]/g, '');
    let difference;
    if (expMeasure === 'm') {
        difference = ((new Date()).getTime() - issuedAt.getTime()) / 1000 / 60;
    } else if (expMeasure === 'd') {
        difference = ((new Date()).getTime() - issuedAt.getTime()) / 1000 / 60 / 60 / 24;
    }
    return (expNumber < difference);
}

/**
 * Fetches new tokens using the refresh token stored in local storage
 * @returns {Promise<object>} - Object containing refreshed access and refresh tokens
 */
async function refreshToken() {
    const refreshedTokens = await fetch('http://localhost:3000/api/authorization/refresh', {
        method: 'POST',
        body: JSON.stringify({
            refresh_token: localStorage.getItem('refresh_token')
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());
    return refreshedTokens;
}

/**
 * Optionally refreshes the access token if it is expired
 * @returns {Promise<void>}
 */
async function optionalRefresh() {
    if (isExpired(localStorage.getItem('access_token'))) {
        const tokens = await refreshToken();
        localStorage.setItem('access_token', tokens.access_token);
    }
}

export {
    optionalRefresh
};
