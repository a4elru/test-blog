'use strict';

// get random int from 0 to max-1
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
// get random string from ['a'..'z','A'..'Z','0'..'9']
function getRandomString(length) {
    let dict = '';
    for (let i = '0'.charCodeAt(); i <= '9'.charCodeAt(); i++) {
        dict += String.fromCodePoint(i);
    }
    for (let i = 'a'.charCodeAt(); i <= 'z'.charCodeAt(); i++) {
        dict += String.fromCodePoint(i);
    }
    for (let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
        dict += String.fromCodePoint(i);
    }
    let str = '';
    for (let i = 0; i < length; i++) {
        str += dict[getRandomInt(dict.length)];
    }
    return str;
}

module.exports = {
    getRandomInt,
    getRandomString,
};
