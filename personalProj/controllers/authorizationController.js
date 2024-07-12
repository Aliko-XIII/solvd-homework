const crypto = require('crypto');
const { secret } = require('../config/config');
const { User } = require('../models/User');


/**
 * 
 * @param {string} token 
 */
const validateToken = token => {

    const [headerEncoded, payloadEncoded, signature] = token.split('.');

    const testSignature = crypto.createHmac('sha256', secret)
        .update(headerEncoded + '.' + payloadEncoded).digest('base64url');

    return signature === testSignature;

}


const getAccessToken = user => {
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

const getRefreshToken = user => {
    const refreshHeader = {
        "alg": "HS256",
        "typ": "JWT",
        "iat": (new Date()).toString(),
        "exp": "3d"
    };
    const refreshHeaderEncoded = Buffer.from(JSON.stringify(refreshHeader)).toString('base64url');

    const refreshPayloadEncoded = Buffer.from(
        JSON.stringify({ "phone": user.phone })).toString('base64url');

    const refreshSignature = crypto.createHmac('sha256', secret)
        .update(refreshHeaderEncoded + '.' + refreshPayloadEncoded).digest('base64url');
    const refreshToken = `${refreshHeaderEncoded}.${refreshPayloadEncoded}.${refreshSignature}`;

    return refreshToken
}

const loginUser = async (req, res) => {
    try {

        const user = await User.getUserByPhone(req.body['phone']);

        if (!user || user.password != req.body['password']) {
            res.send('Phone or password is not correct');
            return;
        }

        delete user['password'];
        res.send({
            "access_token": getAccessToken(user),
            "refresh_token": getRefreshToken(user)
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getTokenHeader = token => {
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

const isExpired = token => {
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

const refreshToken = async (req, res) => {
    try {
        console.log(req.body);
        const refreshToken = req.body.refresh_token;
        console.log(refreshToken);
        !refreshToken ? res.send('No refresh token in request') : null;
        !validateToken(refreshToken) ? res.send('Refresh token is not valid') : null;
        // isExpired(refreshToken);
        const phone = getTokenPayload(refreshToken)['phone'];
        const user = await User.getUserByPhone(phone);
        res.send({
            "access_token": getAccessToken(user),
            "refresh_token": getRefreshToken(user)
        });
    } catch (err) {
        res.status(500).send(err);
    }
};


module.exports = {
    loginUser,
    validateToken,
    refreshToken,
    isExpired
};
