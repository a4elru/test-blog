# Endpoints client

Клиентская часть взаимодействует с API через http-запросы.

Страницы:
- /client/blog - блог
- /client/sign-up - регистрация
- /client/log-in - вход

Статьи блога недоступны для просмотра неавторизованным пользователям.

# Endpoints API

## 1. POST /auth/new - регистрация

Запрос:

```http
POST /auth/new HTTP/1.1
{
    "login": "{login}",
    "password": "{password}",
    "username": "{username}"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Account created successful."
}
```

## 2. POST /auth - аутентификация

Запрос:

```http
POST /auth HTTP/1.1
{
    "login": "{login}",
    "password": "{password}"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "access_token": "{access_token}"
}
```

## 3. GET /auth - проверка авторизации

Запрос:

```http
GET /auth HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Authorized as \"{login}\""
}
```

## 4. GET /api/posts?p={page} - доступ к статьям блога

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
        "user_id": "{your user id}",
        "username": "{your username}"
    },
    "posts": [
        {
            "id": 4,
            "timestamp": "1684009212989",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 5.",
        },
        ...
        {
            "id": 3,
            "timestamp": "1684009212979",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 1.",
        }
    ]
}
```

## 5. GET /api/posts/1 - доступ к статье по ID

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
    "post": {
            "id": {post_id},
            "timestamp": "1684009212989",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number 1.",
    }
}
```

## 6. POST /api/posts - публикация статьи

Запрос:

```http
POST /api/posts HTTP/1.1
Authorization: Bearer {access_token}
{
    "text": "{text}"
}
```

Ответ в случае успеха:

```http
201 Created
{
    "message": "Post publicated."
}
```

## 7. DELETE /api/posts - удаление статьи

Запрос:

```http
DELETE /api/posts HTTP/1.1
Authorization: Bearer {access_token}
{
    "id": "{id}"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Delete successful."
}
```

## 8. PATCH /api/posts - обновление текста статьи

Запрос:

```http
UPDATE /api/posts HTTP/1.1
Authorization: Bearer {access_token}
{
    "id": "{id}",
    "text": "{text}"
}
```

Ответ в случае успеха:

```http
200 OK
{
    "message": "Update successful."
}
```
