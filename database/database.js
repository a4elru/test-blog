'use strict';

let predropDB = true;

const { Client } = require('pg');
const sql = require('./sql-queries');

const { PG_CONFIG } = require('../params');
const client = new Client(PG_CONFIG);

async function initDatabase() {
    await client.connect();

    if (predropDB) {
        await client.query(sql.dropTableIE_posts);
        await client.query(sql.dropTableIE_users);

        await client.query(sql.createTableINE_users);
        await client.query(sql.createTableINE_posts);

        const users = require('./demo-users');
        for (let user of users) {
            const params = [user.login, user.username, user.password];
            await client.query(sql.insert_user, params);
        }

        const posts = require('./demo-posts');
        for (let post of posts) {
            const { rows } = await client.query(sql.get_user_by_login, [post.login]);
            const [ user ] = rows;
            const params = [post.timestamp, user.id, post.text];
            await client.query(sql.insert_post, params);
        }
    }
}

async function closeDatabase() {
    await client.end();
}

async function getUserById(id) {
    const { rows } = await client.query(sql.get_user_by_id, [ id ]);
    return rows[0];
}

async function getUserByLoginAndPassword(login, password) {
    const params = [ login, password ];
    const { rows } = await client.query(sql.get_user_by_login_and_password, params);
    return rows[0];
}

async function getUserByLogin(login) {
    const { rows } = await client.query(sql.get_user_by_login, [ login ]);
    return rows[0];
}

async function insertUser(login, username, password) {
    const params = [ login, username, password ];
    const { rowCount } = await client.query(sql.insert_user, params);
    return (rowCount === 1);
}

async function getPostsByPage(firstId, limit) {
    const params = [ firstId, limit ];
    const { rows } = await client.query(sql.select_posts_by_page, params);
    return rows;
}

async function insertPost(timestamp, userId, text) {
    const params = [ timestamp, userId, text ];
    const { rowCount } = await client.query(sql.insert_post, params);
    return (rowCount === 1);
}

module.exports = {
    initDatabase,
    closeDatabase,
    getUserById,
    getUserByLoginAndPassword,
    getUserByLogin,
    insertUser,
    getPostsByPage,
    insertPost,
};
