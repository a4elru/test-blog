# Endpoints client

Клиентская часть взаимодействует с API через http-запросы.

Страницы:
- /client/blog - блог
- /client/sign-up - регистрация
- /client/log-in - вход

Статьи блога недоступны для просмотра неавторизованным пользователям.

# Endpoints API

## POST /auth/new - регистрация

Запрос:

```http
POST /auth/new HTTP/1.1
{
    "login": "bee@gmail.com",
    "password": "bee",
    "username": "BEE"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Account created successful."
}
```

Варианты ответа в остальных случаях:

```http
400 Bad Request
{
    "message": "Login already exists."
}
```

```http
400 Bad Request
{
    "message": "Empty fields are not allowed."
}
```

## POST /auth - аутентификация

Запрос:

```http
POST /auth HTTP/1.1
{
    "login": "bee@gmail.com",
    "password": "bee"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "access_token": "{access_token}"
}
```

Варианты ответа в остальных случаях:

```http
400 Bad Request
{
    "message": "Incorrect login or password"
}
```

## GET /auth - проверка авторизации

Запрос:

```http
GET /auth HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Authorized as \"bee@gmail.com\""
}
```

Варианты ответа в остальных случаях:

```http
401 Unauthorized
{
    "message": "Not authorized"
}
```

## GET /api/posts?p={page} - доступ к статьям блога

Запрос:

```http
GET /api/posts?p=1 HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
{
    "authorization": {
        "user_id": {your user id},
        "username": {your username}
    },
    "posts": [
        {
            "id": 4,
            "timestamp": "1684009212989",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 4.",
        },
        ...
        {
            "id": 3,
            "timestamp": "1684009212979",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 3.",
        }
    ]
}
```

Варианты ответа в остальных случаях:

```http
401 Unauthorized
{
    "message": "Not authorized"
}
```

## GET /api/posts/1 - доступ к статье по ID

Запрос:

```http
GET /api/posts/{post_id} HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
{
    "authorization": {
        "user_id": {your user id},
        "username": {your username}
    },
    "posts": [
        {
            "id": {post_id},
            "timestamp": "1684009212989",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 1.",
        }
    ]
}
```

## POST /api/posts - публикация статьи

Запрос:

```http
POST /api/posts HTTP/1.1
Authorization: Bearer {access_token}
{
    "text": "Text of new post."
}
```

Ответ в случае успеха:

```http
201 Created
{
    "message": "Post publicated."
}
```

Варианты ответа в остальных случаях:

```http
400 Bad Request
{
    "message": "Post must not be empty."
}
```

```http
401 Unauthorized
{
    "message": "Not authorized"
}
```

## DELETE /api/posts - удаление статьи

Запрос:

```http
DELETE /api/posts HTTP/1.1
Authorization: Bearer {access_token}
{
    "id": "1"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Delete successful."
}
```

Варианты ответа в остальных случаях:

```http
400 Bad Request
{
    "message": "Post id required."
}
```

```http
400 Bad Request
{
    "message": "Incorrect value id."
}
```

```http
403 Forbidden
{
    "message": "Forbidden."
}
```

```http
404 Post not found
{
    "message": "Post not found."
}
```
