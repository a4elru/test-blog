'use strict';

const queries = {};

// USERS
queries.createTableINE_users = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)`;
queries.dropTableIE_users = `
DROP TABLE IF EXISTS users`;
queries.insert_user = `
INSERT INTO users(
    login, username, password
) VALUES (
    $1::text, $2::text, $3::text
)`;
queries.get_user_by_login_and_password = `
SELECT id, login, username FROM users WHERE login=$1::text AND password=$2::text`;
queries.get_user_by_id = `
SELECT id, login, username FROM users WHERE id=$1::integer`;
queries.get_user_by_login = `
SELECT id, login, username FROM users WHERE login=$1::text`;

// POSTS
queries.createTableINE_posts = `
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    userId BIGINT REFERENCES users(id),
    text TEXT NOT NULL
)`;
queries.dropTableIE_posts = `
DROP TABLE IF EXISTS posts`;
queries.insert_post = `
INSERT INTO posts(
    timestamp, userId, text
) VALUES (
    $1::bigint, $2::integer, $3::text
)`;
queries.delete_post = `
DELETE FROM posts
WHERE id=$1::integer AND userId=$2::integer
`;
const post = `
SELECT posts.id, posts.timestamp, posts.userId as user_id,
       users.username, posts.text
`;
queries.get_post_by_id = post + `
FROM posts
JOIN users ON posts.userId = users.id
WHERE posts.id=$1::integer;
`;
queries.get_posts_by_page = post + `
FROM posts
JOIN users ON posts.userId = users.id
ORDER BY posts.id DESC
LIMIT $2::integer OFFSET $1::integer;
`;

Object.freeze(queries);
module.exports = queries;
