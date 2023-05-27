'use strict';

const db = require('./database/database');
db.initDatabase();

const express = require('express');

const router0 = express.Router();

const routerAPI = require('./routers/api');
const routerAUTH = require('./routers/auth');

router0.use('/api', routerAPI);
router0.use('/auth', routerAUTH);

module.exports = router0;
