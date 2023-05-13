'use strict';

const paginationSize = 2;

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const authJWT = require('../middleware/auth-jwt');

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
        const allPosts = require('../database/posts');

        let skip = paginationSize * (request.query.p - 1);
        let pop = paginationSize;
        let posts = [];
        let currentPost = allPosts.length - 1;
        while (pop > 0 && currentPost >= 0) {
            if (skip > 0) {
                skip--;
                currentPost--;
                continue;
            }
            posts[paginationSize - pop] = allPosts[currentPost];
            pop--;
            currentPost--;
        }

        const username = request.isAuthenticated.username;
        response.envelope(200, { username, posts });
    } else {
        response.envelope(401, { message: "Not authorized" });
    }
});

router0.post('/posts', async (request, response) => {
    if (request.isAuthenticated) {
        if (!request.body.text) {
            response.envelope(404, { message: "Post must not be empty." });
            return;
        }

        const posts = require('../database/posts');

        const post = {
            "id": posts.length + 1,
            "timestamp": Date.now(),
            "login": request.isAuthenticated.login,
            "username": request.isAuthenticated.username,
            "text": request.body.text
        }

        posts[posts.length] = post;
        response.envelope(200, { message: "Post publicated." });
    } else {
        response.envelope(401, { message: "Not authorized" });
    }
});

module.exports = router0;
