'use strict';

const { TOKEN_KEY } = require('../params');
const jwt = require('jsonwebtoken');
const users = require('../database/users');

function funcReturner() {
    return func;
}

function func(request, response, next) {
    if ('isAuthenticated' in request) {
        throw new Error();
    }
    request.isAuthenticated = clientIsAuthenticated(request);
    next();
}

function clientIsAuthenticated(request) {
    let authorization = request.get('authorization');
    if (authorization === undefined) return false;

    let [authenticationScheme, base64credentials] = authorization.split(' ');
    if (authenticationScheme !== 'Bearer') return false;

    let returnValue = false;
    jwt.verify(
        base64credentials,
        TOKEN_KEY,
        (error, payload) => {
            if (error) return false;
            if (payload) {
                for (let user of users) {
                    if (user.id === payload.id) {
                        returnValue = user;
                        return true;
                    }
                }
            }
            return false;
        }
    );
    return returnValue;
}

module.exports = funcReturner;
