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
    "username": "{your username}",
    "posts": [
        {
            "id": 4,
            "timestamp": "1684009212989",
            "text": "Post number 4.",
            "username": "BEE"
        },
        ...
        {
            "id": 3,
            "timestamp": "1684009212979",
            "text": "Post number 3.",
            "username": "BEE"
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
200 OK
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