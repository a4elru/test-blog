'use strict';

const { HTTP_PORT } = require('./params');
const express = require('express');
const http = require('http');
const db = require('./database/database');

const routerAPI = require('./routers/api');
const routerAUTH = require('./routers/auth');
const routerClient = require('./routers/client');

const app = express();
db.initDatabase();

app.use('/api', routerAPI);
app.use('/auth', routerAUTH);
app.use('/client', routerClient);

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`Server listens http://localhost:${HTTP_PORT}`);
});
