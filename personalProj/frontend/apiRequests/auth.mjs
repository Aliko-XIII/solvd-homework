/**
 * Extracts user information from access token
 * @param {object} tokens - Object containing access and refresh tokens
 * @returns {object} - User object with tokens
 */
function getUserFromToken(tokens) {
    const payloadEncoded = tokens.access_token.split('.')[1];
    const payloadDecoded = atob(payloadEncoded);
    const payload = JSON.parse(payloadDecoded);
    const user = {
        ...payload,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
    };
    return user;
}

/**
 * Fetches tokens from the login API using provided phone and password
 * @param {string} phone - User's phone number
 * @param {string} password - User's password
 * @returns {Promise<object>} - Object containing access and refresh tokens
 */
async function getTokens(phone, password) {
    const tokensObj = await fetch('http://localhost:3000/api/authorization/login', {
        method: 'POST',
        body: JSON.stringify({
            phone: phone,
            password: password,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());
    return tokensObj;
}

/**
 * Logs in the user, stores tokens in local storage, and returns user object
 * @param {string} phone - User's phone number
 * @param {string} password - User's password
 * @returns {Promise<object>} - User object with tokens
 */
async function loginUser(phone, password) {
    const tokens = await getTokens(phone, password);
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    const user = getUserFromToken(tokens);
    return user;
}

export default {
    loginUser,
};
