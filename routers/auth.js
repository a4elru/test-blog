'use strict';

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const authJWT = require('../middleware/auth-jwt');

const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../params');

const router0 = express.Router();

router0.use(express.json());
router0.use(envelopeResponse());
router0.use(authJWT());

router0.get('/', (request, response) => {
    if (request.isAuthenticated) {
        let login = request.isAuthenticated.login;
        response.envelope(200, { message: `Authorized as "${login}"` });
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

router0.post('/', (request, response) => {
    const users = require('../database/users');
    for (let user of users) {
        if (
            request.body.login === user.login &&
            request.body.password === user.password
        ) {
            let access_token = jwt.sign({ id: user.id }, TOKEN_KEY);
            response.envelope(200, { access_token } );
            return;
        }
    }
    response.envelope(404, { message: 'Incorrect login or password' });
});

router0.post('/new', (request, response) => {
    const users = require('../database/users');

    for (let user of users) {
        if (request.body.login === user.login) {
            response.envelope(404, { message: 'Login already exists.' } );
            return;
        }
    }

    const user = {
        id: users.length + 1,
        login: request.body.login,
        password: request.body.password,
        username: request.body.username,
    };

    users[users.length] = user;

    response.envelope(200, { message: 'Account created successful.' } );
});

module.exports = router0;
