// DB imports
const { User } = require('../models/User');
const { query } = require("../config/database");

// Encryption imports
const crypto = require('crypto');
require('dotenv').config();
const secret = process.env.SECRET;

/**
 * 
 * @param {string} token 
 */
function validateSignature(token) {
    const [headerEncoded, payloadEncoded, signature] = token.split('.');

    const testSignature = crypto.createHmac('sha256', secret)
        .update(headerEncoded + '.' + payloadEncoded).digest('base64url');

    return signature === testSignature;
}

function createAccessToken(user) {
    const accessHeader = {
        "alg": "HS256",
        "typ": "JWT",
        "iat": Date(),
        "exp": "1m"
    };

    const accessHeaderEncoded = Buffer.from(JSON.stringify(accessHeader)).toString('base64url');

    const accessPayloadEncoded = Buffer.from(JSON.stringify(user)).toString('base64url');

    const signature = crypto.createHmac('sha256', secret)
        .update(accessHeaderEncoded + '.' + accessPayloadEncoded).digest('base64url');

    const accessToken = `${accessHeaderEncoded}.${accessPayloadEncoded}.${signature}`;
    return accessToken;
}

function createRefreshToken(user) {
    const refreshHeader = {
        "alg": "HS256",
        "typ": "JWT",
        "iat": (new Date()).toString(),
        "exp": "3d"
    };
    const refreshHeaderEncoded = Buffer.from(JSON.stringify(refreshHeader)).toString('base64url');

    const refreshPayloadEncoded = Buffer.from(
        JSON.stringify({ "id": user.id })).toString('base64url');

    const refreshSignature = crypto.createHmac('sha256', secret)
        .update(refreshHeaderEncoded + '.' + refreshPayloadEncoded).digest('base64url');

    const refreshToken = `${refreshHeaderEncoded}.${refreshPayloadEncoded}.${refreshSignature}`;
    return refreshToken
}

async function updateRefresh(user_id, refresh_token) {
    const expires_at = (new Date(getExpiration(refresh_token))).toISOString();
    const res = await query(`INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
    VALUES ('${user_id}', '${refresh_token}', '${expires_at}')
    ON CONFLICT (user_id)
    DO UPDATE SET refresh_token = EXCLUDED.refresh_token, expires_at = EXCLUDED.expires_at;`);

}

async function isRefreshValid(user_id, refresh_token) {
    const res = await query(`SELECT * FROM refresh_tokens
        WHERE user_id = '${user_id}'
        AND expires_at > NOW();`);
    return res.rows.length !== 0 && refresh_token === res.rows[0].refresh_token;
}

async function loginUser(req, res) {
    try {
        const user = await User.getUserByPhone(req.body['phone']);

        if (!user || user.password != req.body['password']) {
            res.send('Phone or password is not correct');
            return;
        }

        delete user['password'];
        const access_token = createAccessToken(user);
        const refresh_token = createRefreshToken(user);

        await updateRefresh(user.id, refresh_token);

        res.send({
            "access_token": access_token,
            "refresh_token": refresh_token
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

function getTokenHeader(token) {
    const headerEncoded = token.split('.')[0];
    const headerDecoded = Buffer.from(headerEncoded, 'base64url').toString();
    const header = JSON.parse(headerDecoded);
    return header
}

const getTokenPayload = token => {
    const payloadEncoded = token.split('.')[1];
    const payloadDecoded = Buffer.from(payloadEncoded, 'base64url').toString();
    const payload = JSON.parse(payloadDecoded);
    return payload
}

function getExpiration(token) {
    const { iat, exp } = getTokenHeader(token);
    const issuedAt = new Date(iat);
    const expNumber = exp.replace(/[a-z]/g, '');
    const expMeasure = exp.replace(/[0-9]/g, '');

    let expiresAt;
    if (expMeasure === 'm') {
        expiresAt = issuedAt.getTime() + expNumber * 1000 * 60;
    }
    else if (expMeasure === 'd') {
        expiresAt = issuedAt.getTime() + expNumber * 1000 * 60 * 60 * 24;
    }
    return expiresAt;
}

function isTokenExpired(token) {
    const { iat, exp } = getTokenHeader(token);
    const issuedAt = new Date(iat);
    const expNumber = exp.replace(/[a-z]/g, '');
    const expMeasure = exp.replace(/[0-9]/g, '');
    let difference;
    if (expMeasure === 'm') {
        difference = ((new Date()).getTime() - issuedAt.getTime()) / 1000 / 60;
    }
    else if (expMeasure === 'd') {
        difference = ((new Date()).getTime() - issuedAt.getTime()) / 1000 / 60 / 60 / 24;
    }
    return (expNumber < difference);
}

async function refreshAccessToken(req, res) {
    try {
        const refreshToken = req.body.refresh_token;
        !refreshToken ? res.send('No refresh token in request') : null;

        const id = getTokenPayload(refreshToken).id;
        const isValid = await isRefreshValid(id, refreshToken);
        !validateSignature(refreshToken) || !isValid ?
            res.status(400).send('Refresh token is not valid') : null;

        const user = await User.getUserById(id);
        res.send({
            "access_token": createAccessToken(user)
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

async function validateToken(req, res, next) {
    const isValid = req.headers.authorization
        && validateSignature(req.headers.authorization)
        && !isTokenExpired(req.headers.authorization);

    isValid ?
        next() :
        res.status(500).send('Authorization is not valid!');
}


module.exports = {
    loginUser,
    refreshAccessToken,
    validateToken
};
