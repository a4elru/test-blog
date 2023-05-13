'use strict';

const db = require('../database/database');

const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../params');

function funcReturner() {
    return func;
}

async function func(request, response, next) {
    if ('isAuthenticated' in request) {
        throw new Error();
    }
    request.isAuthenticated = await clientIsAuthenticated(request);
    next();
}

async function clientIsAuthenticated(request) {
    let authorization = request.get('authorization');
    if (authorization === undefined) return false;

    let [authenticationScheme, base64credentials] = authorization.split(' ');
    if (authenticationScheme !== 'Bearer') return false;

    let returnValue = false;
    await jwt.verify(
        base64credentials,
        TOKEN_KEY,
        async (error, payload) => {
            if (error) return false;
            if (payload) {
                let user = await db.getUserById(payload.id);
                if (user) {
                    returnValue = user;
                    return true;
                }
            }
            return false;
        }
    );
    return returnValue;
}

module.exports = funcReturner;
