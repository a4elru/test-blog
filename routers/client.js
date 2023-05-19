'use strict';

const express = require('express');
const htmlResponse = require('../middleware/html-response');
const cookieParser = require('cookie-parser');

const axios = require('axios');
const fs = require('fs');

const router0 = express.Router();

router0.use(express.urlencoded({ extended: ['html']}));
router0.use(htmlResponse());
router0.use(cookieParser());

router0.use((request, response, next) => {
    console.log(request.url);
    next();
});

router0.get('/blog', async (request, response) => {
    const referer = request.get('referer');
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
        if (error.response.status === 401) {
            let body = readStatic('./static/form-go-to-auth.html');
            result = result.replace('${body}', body);
            response.html(200, result);
            return;
        } else {
            axiosErrorLog(error);
            let result = readStatic('./static/500.html');
            response.html(500, result);
            return;
        }
    }

    const authorization = axiosResponse.data.authorization;
    let posts = axiosResponse.data.posts;

    let formPublish = readStatic('./static/form-publish.html');
    response.cookie('i', '', { expires: new Date(0) }); // remove cookie
    switch (request.cookies.i) {
    case undefined:
        formPublish = formPublish.replace('${info}', '');
        break;
    case '1':
        formPublish = formPublish.replace('${info}', '<br><br><a>Пост не должен быть пустым.</a>');
        break;
    case '2':
        formPublish = formPublish.replace('${info}', '<br><br><a>Внутренняя ошибка.</a>');
        break;
    case '3':
        formPublish = formPublish.replace('${info}', '<br><br><a>Пост опубликован.</a>');
        break;
    case '4':
        formPublish = formPublish.replace('${info}', '<br><br><a>Ошибка удаления.</a>');
        break;
    case '5':
        formPublish = formPublish.replace('${info}', '<br><br><a>Неверный идентификатор поста.</a>');
        break;
    case '6':
        formPublish = formPublish.replace('${info}', '<br><br><a>Пост удалён.</a>');
        break;
    case '7':
        formPublish = formPublish.replace('${info}', '<br><br><a>Пост обновлён.</a>');
        break;
    default:
        formPublish = formPublish.replace('${info}', '<br><br><a>Непредвиденная ошибка.</a>');
        break;
    }
    formPublish = formPublish.replace('${username}', authorization.username);

    let body = '';
    let formPost = readStatic('./static/form-post.html');
    let formPostWithButtons = readStatic('./static/form-post-with-buttons.html');
    if (posts.length > 0) {
        body += '<script type="text/javascript" src="script.js"></script>';
    }
    for (let i = 0; i < posts.length; i++) {
        let formCurrent;
        if (posts[i].user_id == authorization.user_id) {
            formCurrent = String(formPostWithButtons);
            formCurrent = formCurrent.replaceAll('${id}', posts[i].id);
        } else {
            formCurrent = String(formPost);
        }
        formCurrent = formCurrent.replace('${username}', posts[i].username);
        let timestamp = `<script type="text/javascript">document.write(
dateToString(${posts[i].timestamp}))</script>`;
        formCurrent = formCurrent.replace('${timestamp}', timestamp);
        formCurrent = formCurrent.replace('${text}', posts[i].text);
        body += formCurrent;
    }
    body = formPublish + body;

    let formPagination = readStatic('./static/form-pagination.html');
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
    const referer = request.get('referer');
    let text = request.body.text;

    if (!text) {
        response.cookie('i', 1); // session cookie
        response.redirect(referer);
        return;
    }

    let data = JSON.stringify({ 'text': text });
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
        axiosErrorLog(error);
        response.cookie('i', 2); // session cookie
        response.redirect(referer);
        return;
    }
    response.cookie('i', 3); // session cookie
    response.redirect(referer);
});
router0.post('/blog/delete', async (request, response) => {
    const referer = request.get('referer');
    const id = request.body.id;

    if (!id) {
        response.cookie('i', 5); // session cookie
        response.redirect(referer);
        return;
    }

    let data = JSON.stringify({ 'id': id });
    let config = {
        method: 'delete',
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
        axiosErrorLog(error);
        response.cookie('i', 4); // session cookie
        response.redirect(referer);
        return;
    }
    response.cookie('i', 6); // session cookie
    response.redirect(referer);
});
router0.post('/blog/edit', async (request, response) => {
    const referer = request.get('referer');
    let id = request.body.id;
    let text = request.body.text;

    if (!id) {
        response.cookie('i', 5); // session cookie
        response.redirect(referer);
        return;
    }
    if (!text) {
        response.cookie('i', 1); // session cookie
        response.redirect(referer);
        return;
    }

    let data = JSON.stringify({ id, text });
    let config = {
        method: 'patch',
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
        axiosErrorLog(error);
        response.cookie('i', 2); // session cookie
        response.redirect(referer);
        return;
    }
    response.cookie('i', 7); // session cookie
    response.redirect(referer);
});

router0.get('/log-in', async (request, response) => {
    let result = readStatic('./static/page.html');
    let body = readStatic('./static/form-log-in.html');
    if (request.query.e === undefined) {
        body = body.replace('${info}', '');
    } else {
        body = body.replace('${info}', '<br><br><a>Неверный логин или пароль.</a>');
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
        'login': login,
        'password': password
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
        axiosErrorLog(error);
        response.redirect('./log-in?e=1');
        return;
    }

    let { access_token } = axiosResponse.data;
    response.cookie('JWT', access_token); // session cookie
    response.redirect('./blog');
});

router0.get('/sign-up', async (request, response) => {
    let result = readStatic('./static/page.html');
    let body = readStatic('./static/form-sign-up.html');
    if (request.query.i === undefined) {
        body = body.replace('${info}', '');
    } else if (request.query.i === '1') {
        body = body.replace('${info}', '<br><br><a>Обязательны все поля.</a>');
    } else if (request.query.i === '2') {
        body = body.replace('${info}', '<br><br><a>Логин занят.</a>');
    } else if (request.query.i === '3') {
        body = body.replace('${info}', '<br><br><a>Вы зарегистрировались и теперь можете войти.</a>');
    } else {
        body = body.replace('${info}', '<br><br><a>Непредвиденная ошибка.</a>');
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
        'login': login,
        'password': password,
        'username': username
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
        axiosErrorLog(error);
        response.redirect('./sign-up?i=2');
        return;
    }
    response.redirect('./sign-up?i=3');
});

router0.get('/log-out', async (request, response) => {
    response.cookie('JWT', '', { expires: new Date(0) }); // remove cookie
    response.redirect('./blog');
});

router0.get('/style.css', (request, response) => {
    let result = readStatic('./static/style.css');
    response.html(200, result, 'text/css');
});

router0.get('/script.js', (request, response) => {
    let result = readStatic('./static/script.js');
    response.html(200, result, 'text/javascript');
});

function readStatic(filename) {
    return fs
        .readFileSync(filename)
        .toString()
        .replaceAll('\n', '\r\n');
}

function axiosErrorLog(error) {
    const code = error.code;
    const config = {};
    config.headers = error.config.headers;
    config.method = error.config.method;
    config.url = error.config.url;
    config.data = error.config.data;
    const response = {};
    response.status = error.response.status;
    response.statusText = error.response.statusText;
    response.data = error.response.data;
    const info = { code, config, response };
    console.log(info);
}

module.exports = router0;
