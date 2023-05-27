'use strict';

const params = {};

params.HTTP_PORT = process.env['HTTP_PORT'] || 3333;

Object.freeze(params);
module.exports = params;
