'use strict';

const { PAGINATION_SIZE } = require('../params');

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const authJWT = require('../middleware/auth-jwt');
const db = require('../database/database');

const router0 = express.Router();

router0.use(express.json());
router0.use(envelopeResponse());
router0.use(authJWT());

router0.get('/posts', async (request, response) => {
    if (request.isAuthenticated) {
        if (request.query.p === undefined) {
            response.redirect('?p=1');
            return;
        }
        const skip = PAGINATION_SIZE * (request.query.p - 1);
        const limit = PAGINATION_SIZE;
        const posts = await db.getPostsByPage(skip, limit);
        const username = request.isAuthenticated.username;
        response.envelope(200, { username, posts });
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

router0.post('/posts', async (request, response) => {
    if (request.isAuthenticated) {
        if (!request.body.text) {
            response.envelope(400, { message: 'Post must not be empty.' });
            return;
        }
        const post = [
            Date.now(),
            request.isAuthenticated.id,
            request.body.text
        ];
        const ok = await db.insertPost(...post);
        if (ok) {
            response.envelope(200, { message: 'Post publicated.' });
        } else {
            response.envelope(500, { message: 'Internal server error.' });
        }
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

module.exports = router0;
