'use strict';

const params = {};

params.TOKEN_KEY = process.env['TOKEN_KEY'] || 'ZF8xeqXKYqydBgRwIENLc50Vq';
params.PAGINATION_SIZE =  process.env['PAGINATION_SIZE'] || 5;
params.PG_CONFIG = {
    host: process.env['PG_HOST'] || 'localhost',
    port: process.env['PG_PORT'] || 5432,
    database: process.env['PG_DATABASE'] || 'testblog',
    user: process.env['PG_USER'] || 'postgres',
    password: process.env['PG_PASSWORD'] || 'postgres',
    connectionString: process.env['PG_CONNECTION_STRING'] || undefined,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
};

Object.freeze(params);
Object.freeze(params.PG_CONFIG);
module.exports = params;
