export {
    optionalRefresh
}

function getTokenHeader(token) {
    const headerEncoded = token.split('.')[0];
    const headerDecoded = atob(headerEncoded, 'base64url');
    const header = JSON.parse(headerDecoded);
    return header
}

function isExpired(token) {
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

async function refreshToken() {
    const refreshedTokens = fetch('http://localhost:3000/api/authorization/refresh',
        {
            method: 'POST',
            body: JSON.stringify({
                refresh_token:
                    localStorage.getItem('refresh_token')
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }

        })
        .then(res => res.json());
    return refreshedTokens;
}

async function optionalRefresh() {
    if (isExpired(localStorage.getItem('access_token'))) {
        const tokens = await refreshToken();
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
    }
}

