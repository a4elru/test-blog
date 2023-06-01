'use strict';

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const authJWT = require('../middleware/auth-jwt');
const db = require('../database/database');

const fs  = require('fs');
const multer  = require('multer');
const upload = multer();
const random = require('../modules/random');
const { dateToString } = require('../modules/date-formatter');

dropImgDirectory();

const router0 = express.Router();

router0.use(express.json()); // request.body
router0.use(envelopeResponse()); // response.envelope
router0.use(authJWT()); // response.isAuthenticated

router0.use(async (request, response, next) => {
    if (!request.isAuthenticated) {
        response.envelope(401);
        return;
    }
    next();
});

router0.get('/posts', async (request, response) => {
    let p = request.query.p;
    if (!p || !/^\d+$/.test(p)) {
        response.redirect('?p=1');
        return;
    }
    let posts;
    try {
        posts = await db.getPostsByPage(p);
    } catch(error) {
        console.error(error);
        response.envelope(500);
        return;
    }
    const authorization = {
        user_id: request.isAuthenticated.id,
        username: request.isAuthenticated.username,
    };
    response.envelope(200, { authorization, posts });
});

router0.get(/^\/posts\/\d+$/ , async (request, response) => {
    const id = Number(request.path.slice(7));
    let post;
    try {
        post = await db.getPostById(id);
    } catch(error) {
        console.error(error);
        response.envelope(500);
        return;
    }
    const authorization = {
        user_id: request.isAuthenticated.id,
        username: request.isAuthenticated.username,
    };
    response.envelope(200, { authorization, post });
});

router0.post('/posts', upload.single('image'), async (request, response) => {
    if (!request.body.text && !request.file) {
        response.envelope(400, { message: 'Post must not be empty.' });
        return;
    }
    let linkedImage;
    if (request.file) {
        linkedImage = '/service/static/img/' + dateToString(Date.now());
        linkedImage += '-' + random.getRandomString(15);
        let buffer = request.file.buffer;
        fs.writeFileSync('.' + linkedImage, buffer);
    }
    const post = [
        Date.now(),
        request.isAuthenticated.id,
        request.body.text,
        linkedImage,
    ];
    let ok;
    try {
        ok = await db.insertPost(...post);
    } catch(error) {
        console.error(error);
        response.envelope(500);
        return;
    }
    if (ok) {
        response.envelope(201, { message: 'Post publicated.' });
    } else {
        response.envelope(500, { message: 'Post not publicated.' });
    }
});

router0.delete('/posts' , async (request, response) => {
    const id = request.body.id;
    if (!id) {
        response.envelope(400, { message: 'Post id required.' });
        return;
    }
    if (!/^\d+$/.test(id)) {
        response.envelope(400, { message: 'Incorrect value id.' });
        return;
    }
    let post;
    try {
        post = await db.getPostById(id);
    } catch(error) {
        console.error(error);
        response.envelope(500);
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
        response.envelope(500);
        return;
    }
    if (ok) {
        response.envelope(200, { message: 'Delete successful.' });
    } else {
        response.envelope(500, { message: 'Delete error.' });
    }
    if (post.linked_image) {
        fs.unlinkSync('.' + post.linked_image);
    }
});

router0.patch('/posts' , async (request, response) => {
    const id = request.body.id;
    const newText = request.body.text;
    if (!id) {
        response.envelope(400, { message: 'Post id required.' });
        return;
    }
    if (!/^\d+$/.test(id)) {
        response.envelope(400, { message: 'Incorrect value id.' });
        return;
    }
    let post;
    try {
        post = await db.getPostById(id);
    } catch(error) {
        console.error(error);
        response.envelope(500);
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
    if (!newText && !post.linked_image) {
        response.envelope(400, { message: 'Text required.' });
        return;
    }
    let ok;
    try {
        ok = await db.updatePost(newText, id, request.isAuthenticated.id);
    } catch(error) {
        console.error(error);
        response.envelope(500);
        return;
    }
    if (ok) {
        response.envelope(200, { message: 'Update successful.' });
    } else {
        response.envelope(500, { message: 'Update error.' });
    }
});

router0.use((request, response) => {
    response.envelope(404, {});
});

async function dropImgDirectory() {
    fs.rmSync('./service/static/img', { recursive: true, force: true });
    setTimeout(() => {
        fs.mkdirSync('./service/static/img');
    }, '5 second');
}

module.exports = router0;
