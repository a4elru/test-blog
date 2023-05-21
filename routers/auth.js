'use strict';

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const authJWT = require('../middleware/auth-jwt');
const db = require('../database/database');

const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../params');

const router0 = express.Router();

router0.use(express.json()); // request.body
router0.use(envelopeResponse()); // response.envelope
router0.use(authJWT()); // response.isAuthenticated

router0.get('/', (request, response) => {
    if (request.isAuthenticated) {
        let login = request.isAuthenticated.login;
        response.envelope(200, { message: `Authorized as "${login}"` });
    } else {
        response.envelope(401);
    }
});

router0.post('/', async (request, response) => {
    const login = request.body.login;
    const password = request.body.password;
    let user;
    try {
        user = await db.getUserByLoginAndPassword(login, password);
    } catch(error) {
        console.error(error);
        response.envelope(500);
        return;
    }
    if (user) {
        let access_token = jwt.sign({ id: user.id }, TOKEN_KEY);
        response.envelope(200, { access_token });
        return;
    }
    response.envelope(400, { message: 'Incorrect login or password' } );
});

router0.post('/new', async (request, response) => {
    const user = await db.getUserByLogin(request.body.login);
    if (user) {
        response.envelope(400, { message: 'Login already exists.' } );
        return;
    }

    const login = request.body.login;
    const username = request.body.username;
    const password = request.body.password;

    if (!login || !password || !username) {
        response.envelope(400, { message: 'Empty fields are not allowed.' } );
        return;
    }

    const ok = await db.insertUser(login, username, password);
    if (ok) {
        response.envelope(200, { message: 'Account created successful.' } );
    } else {
        response.envelope(500);
    }
});

router0.use((request, response) => {
    response.envelope(404, {});
})

module.exports = router0;
