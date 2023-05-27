'use strict';

const express = require('express');

const router0 = express.Router();

const options = {
    dotfiles: 'ignore',
    extensions: ['*'],
};

router0.use(express.static('./client/static', options));

module.exports = router0;
