'use strict';

const express = require('express');
const htmlResponse = require('../middleware/html-response');
const cookieParser = require('cookie-parser');

const axios = require('axios');
const fs = require('fs');
const { dateToString } = require('../func/date-formatter');

const router0 = express.Router();

router0.use(express.urlencoded({ extended: ['html']}));
router0.use(htmlResponse());
router0.use(cookieParser());

router0.use((request, response, next) => {
    console.log(request.url);
    next();
});

router0.get('/blog', async (request, response) => {
    let result = readStatic('./static/page.html');

    if (request.cookies.JWT === undefined) {
        let body = readStatic('./static/form-go-to-auth.html');
        result = result.replace('${body}', body);
        response.html(200, result);
        return;
    }

    if (request.query.p === undefined) {
        response.redirect('?p=1');
        return;
    }

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3333/api/posts?p=${request.query.p}`,
        headers: { 'Authorization': `Bearer ${request.cookies.JWT}` }
    };
    let axiosResponse;
    try {
        axiosResponse = await axios.request(config);
    } catch (error) {
        console.log(error);
        let body = readStatic('./static/form-go-to-auth.html');
        result = result.replace('${body}', body);
        response.html(200, result);
        return;
    }

    let username = axiosResponse.data.username;
    let posts = axiosResponse.data.posts;

    let formPublish = readStatic('./static/form-publish.html');
    if (request.query.i === undefined) {
        formPublish = formPublish.replace('${info}', '');
    } else if (request.query.i === '1') {
        formPublish = formPublish.replace('${info}', '<br><br><label>Пост не должен быть пустым.</label>');
    } else if (request.query.i === '2') {
        formPublish = formPublish.replace('${info}', '<br><br><label>Внутренняя ошибка.</label>');
    } else if (request.query.i === '3') {
        formPublish = formPublish.replace('${info}', '<br><br><label>Пост опубликован.</label>');
    } else {
        formPublish = formPublish.replace('${info}', '<br><br><label>Непредвиденная ошибка.</label>');
    }
    formPublish = formPublish.replace('${username}', username);

    let body = '';
    let formPost = readStatic('./static/form-post.html');
    for (let i = 0; i < posts.length; i++) {
        let formCurrent = String(formPost);
        formCurrent = formCurrent.replace('${username}', posts[i].username);
        formCurrent = formCurrent.replace('${timestamp}', dateToString(posts[i].timestamp));
        formCurrent = formCurrent.replace('${text}', posts[i].text);
        body += formCurrent;
    }
    body = formPublish + body;

    let formPagination = readStatic('./static/form-pagination.html');
    console.log(request.query.p);
    console.log("request.query.p");
    let p = Number(request.query.p);
    if (p > 1) {
        formPagination = formPagination.replace('${prev}', `<a href="./blog?p=${p - 1}">предыдущая</a>`);
    } else {
        formPagination = formPagination.replace('${prev}', '');
    }
    if (posts.length > 0) {
        formPagination = formPagination.replace('${next}', `<a href="./blog?p=${p + 1}">следующая</a>`);
    } else {
        formPagination = formPagination.replace('${next}', '');
    }
    body += formPagination;

    result = result.replace('${body}', body);
    response.html(200, result);
});
router0.post('/blog', async (request, response) => {
    let text = request.body.text;

    let p = request.query.p || '1';

    if (!text) {
        response.redirect(`./blog?p=${p}&i=1`);
        return;
    }

    let data = JSON.stringify({ "text": text });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3333/api/posts',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${request.cookies.JWT}`
        },
        data: data
    };
    let axiosResponse;
    try {
        axiosResponse = await axios.request(config);
    } catch (error) {
        response.redirect(`./blog?p=${p}&i=2`);
        return;
    }
    response.redirect(`./blog?p=${p}&i=3`);
});

router0.get('/log-in', async (request, response) => {
    let result = readStatic('./static/page.html');
    let body = readStatic('./static/form-log-in.html');
    if (request.query.e === undefined) {
        body = body.replace('${info}', '');
    } else {
        body = body.replace('${info}', '<br><br><label>Неверный логин или пароль.</label>');
    }
    result = result.replace('${body}', body);
    response.html(200, result);
});
router0.post('/log-in', async (request, response) => {
    let login = request.body.login;
    let password = request.body.password;

    if (!login && !password) {
        response.redirect('./log-in?e=1');
        return;
    }

    let data = JSON.stringify({
        "login": login,
        "password": password
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3333/auth',
        headers: { 'Content-Type': 'application/json' },
        data: data
    };
    let axiosResponse;
    try {
        axiosResponse = await axios.request(config);
    } catch (error) {
        response.redirect('./log-in?e=1');
        return;
    }

    let { access_token } = axiosResponse.data;
    console.log(access_token);
    response.cookie('JWT', access_token);
    response.redirect('./blog');
});

router0.get('/sign-up', async (request, response) => {
    let result = readStatic('./static/page.html');
    let body = readStatic('./static/form-sign-up.html');
    if (request.query.i === undefined) {
        body = body.replace('${info}', '');
    } else if (request.query.i === '1') {
        body = body.replace('${info}', '<br><br><label>Обязательны все поля.</label>');
    } else if (request.query.i === '2') {
        body = body.replace('${info}', '<br><br><label>Логин занят.</label>');
    } else if (request.query.i === '3') {
        body = body.replace('${info}', '<br><br><label>Вы зарегистрировались и теперь можете войти.</label>');
    } else {
        body = body.replace('${info}', '<br><br><label>Непредвиденная ошибка.</label>');
    }
    result = result.replace('${body}', body);
    response.html(200, result);
});
router0.post('/sign-up', async (request, response) => {
    let login = request.body.login;
    let password = request.body.password;
    let username = request.body.username;

    if (!login && !password && !username) {
        response.redirect('./sign-up?i=1');
        return;
    }

    let data = JSON.stringify({
        "login": login,
        "password": password,
        "username": username
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3333/auth/new',
        headers: { 'Content-Type': 'application/json' },
        data: data
    };
    let axiosResponse;
    try {
        axiosResponse = await axios.request(config);
    } catch (error) {
        response.redirect('./sign-up?i=2');
        return;
    }
    response.redirect('./sign-up?i=3');
});

router0.get('/log-out', async (request, response) => {
    response.cookie('JWT', '', { expires: 0 });
    response.redirect('./blog');
});

router0.get('/style.css', (request, response) => {
    let result = readStatic('./static/style.css');
    response.html(200, result, 'text/css');
});

function readStatic(filename) {
    return fs
        .readFileSync(filename)
        .toString()
        .replaceAll('\n', '\r\n');
}

module.exports = router0;
