# Локальный запуск

- клонируйте репозиторий и установите зависимости
- установите PostgreSQL и создайте базу данных под проект
- добавьте в params.js корректные сведения о PostgreSQL
- выполните `npm start` или `yarn start`
- перейдите на http://localhost:3333/

# Endpoints client

Клиентская часть взаимодействует с API через http-запросы.

Страницы:
- /client/client/blog - блог
- /client/client/sign-up - регистрация
- /client/client/log-in - вход

Статьи блога недоступны для просмотра неавторизованным пользователям.

# Endpoints API

Наличие заголовка `Content-Type` предполагает наличие корректного заголовка `Content-Length`.

## 1. POST /service/auth/new - регистрация

Запрос:

```http
POST /service/auth/new HTTP/1.1
Content-Type: application/json
{
    "login": "{login}",
    "password": "{password}",
    "username": "{username}"
}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
{
    "message": "Account created successful."
}
```

## 2. POST /service/auth - аутентификация

Запрос:

```http
POST /service/auth HTTP/1.1
Content-Type: application/json
{
    "login": "{login}",
    "password": "{password}"
}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
{
    "access_token": "{access_token}"
}
```

## 3. GET /service/auth - проверка авторизации

Запрос:

```http
GET /service/auth HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
{
    "message": "Authorized as \"{login}\""
}
```

## 4. GET /service/api/posts?p={page} - доступ к статьям блога

Запрос:

```http
GET /service/api/posts?p={page} HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
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
            "linked_image": "/service/static/img/{filename 1}"
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

## 5. GET /service/api/posts/{post_id} - доступ к статье по ID

Запрос:

```http
GET /service/api/posts/{post_id} HTTP/1.1
Authorization: Bearer {access_token}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
{
    "authorization": {
        "user_id": "{your user id}",
        "username": "{your username}"
    },
    "post": {
            "id": "{post_id}",
            "timestamp": "1684009212989",
            "user_id": "1"
            "username": "BEE"
            "text": "Post number.",
    }
}
```

## 6. POST /service/api/posts - публикация статьи

Отправлять файл необязательно.

Запрос:

```http
POST /service/api/posts HTTP/1.1
Authorization: Bearer {access_token}
Content-Type: multipart/form-data; boundary=BOUNDARY

--BOUNDARY
Content-Disposition: form-data; name="text"

{text}
--BOUNDARY
Content-Disposition: form-data; name="image"; filename="image.jpg"
Content-Type: image/jpeg

{binary data}
--BOUNDARY--

```

Ответ в случае успеха:

```http
201 Created
Content-Type: application/json
{
    "message": "Post publicated."
}
```

## 7. DELETE /service/api/posts - удаление статьи

Запрос:

```http
DELETE /service/api/posts HTTP/1.1
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

## 8. PATCH /service/api/posts - обновление текста статьи

Запрос:

```http
UPDATE /service/api/posts HTTP/1.1
Authorization: Bearer {access_token}
Content-Type: application/json
{
    "id": "{id}",
    "text": "{text}"
}
```

Ответ в случае успеха:

```http
200 OK
Content-Type: application/json
{
    "message": "Update successful."
}
```
