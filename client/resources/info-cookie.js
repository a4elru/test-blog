'use strict';

const mnemo_to_text = {};
mnemo_to_text.UNHANDLED_EXCEPTION_ERROR = '<br><br><a>Неизвестная ошибка.</a>';
mnemo_to_text.EMPTY_POST_ERROR = '<br><br><a>Пост не должен быть пустым.</a>';
mnemo_to_text.UNKNOWN_ID_ERROR = '<br><br><a>Некорректный идентификатор поста.</a>';
mnemo_to_text.POST_IS_PUBLISHED = '<br><br><a>Пост опубликован.</a>';
mnemo_to_text.POST_IS_DELETED = '<br><br><a>Пост удалён.</a>';
mnemo_to_text.POST_IS_UPDATED = '<br><br><a>Пост обновлён.</a>';
mnemo_to_text.ONLY_JPEG_ALLOWED_ERROR = '<br><br><a>Разрешается прикреплять только изображения типа JPG/JPEG.</a>';

const mnemo_to_id = {};
let new_id = 1;
for(let mnemo in mnemo_to_text) {
    mnemo_to_id[mnemo] = new_id;
    new_id++;
}

const id_to_text = [];
for(let mnemo in mnemo_to_text) {
    id_to_text[mnemo_to_id[mnemo]] = mnemo_to_text[mnemo];
}
id_to_text[undefined] = '';

mnemo_to_id.displayFromID = id_to_text;

module.exports = mnemo_to_id;
