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
        let posts;
        try {
            posts = await db.getPostsByPage(skip, limit);
        } catch(error) {
            console.error(error);
            response.envelope(500, { message: 'Internal server error.' });
            return;
        }
        const authorization = {
            user_id: request.isAuthenticated.id,
            username: request.isAuthenticated.username,
        };
        response.envelope(200, { authorization, posts });
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

router0.get(/^\/posts\/\d+$/ , async (request, response) => {
    if (request.isAuthenticated) {
        const id = Number(request.path.slice(7));
        let posts;
        try {
            posts = await db.getPostById(id);
        } catch(error) {
            console.error(error);
            response.envelope(500, { message: 'Internal server error.' });
            return;
        }
        const authorization = {
            user_id: request.isAuthenticated.id,
            username: request.isAuthenticated.username,
        };
        response.envelope(200, { authorization, posts });
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
        let ok;
        try {
            ok = await db.insertPost(...post);
        } catch(error) {
            console.error(error);
            response.envelope(500, { message: 'Internal server error.' });
            return;
        }
        if (ok) {
            response.envelope(201, { message: 'Post publicated.' });
        } else {
            response.envelope(500, { message: 'Post not publicated.' });
        }
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

router0.delete('/posts' , async (request, response) => {
    if (request.isAuthenticated) {
        const id = request.body.id;
        if (!id) {
            response.envelope(400, { message: 'Post id required.' });
            return;
        }
        if (!isFinite(id)) {
            response.envelope(400, { message: 'Incorrect value id.' });
            return;
        }
        let post;
        try {
            post = await db.getPostById(id);
        } catch(error) {
            console.error(error);
            response.envelope(500, { message: 'Internal server error.' });
            return;
        }
        if (!post) {
            response.envelope(404, { message: 'Post not found.' });
            return;
        }
        if (post.user_id != request.isAuthenticated.id) {
            response.envelope(403, { message: 'Forbidden.' });
            return;
        }
        let ok;
        try {
            ok = await db.deletePost(id, request.isAuthenticated.id);
        } catch(error) {
            console.error(error);
            response.envelope(500, { message: 'Internal server error.' });
            return;
        }
        if (ok) {
            response.envelope(200, { message: 'Delete successful.' });
        } else {
            response.envelope(500, { message: 'Delete error.' });
        }
    } else {
        response.envelope(401, { message: 'Not authorized' });
    }
});

module.exports = router0;
