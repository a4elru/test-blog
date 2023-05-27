'use strict';

const express = require('express');

const router0 = express.Router();

const routerClient = require('./routers/client');
const routerStatic = require('./routers/static');

router0.use('/client', routerClient);
router0.use('/static', routerStatic);

module.exports = router0;
