'use strict';

const { HTTP_PORT } = require('./params');
const express = require('express');
const http = require('http');

const routerService = require('./service');
const routerClient = require('./client');

const app = express();

app.use((request, response, next) => {
    console.log(request.url);
    next();
});

app.get('/', (_, response) => response.redirect('/client/client/blog'));
app.use('/service', routerService);
app.use('/client', routerClient);

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`Server listens http://localhost:${HTTP_PORT}`);
});
