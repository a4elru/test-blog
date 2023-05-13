'use strict';

// example: "2023.02.14 12:45:98"
function dateToString(milliseconds) {
    const ms = Number(milliseconds);
    let d = new Date(ms);
    d = d.getFullYear() +
        '.' +
        ((1 + d.getMonth() < 10) ? '0' : '') + (1 + d.getMonth()) +
        '.' +
        ((d.getDate() < 10) ? '0' : '') + (d.getDate()) +
        ' ' +
        ((d.getHours()<10) ? '0' : '') + (d.getHours()) +
        ':' +
        ((d.getMinutes()<10) ? '0' : '') + (d.getMinutes()) +
        ':' +
        ((d.getSeconds()<10) ? '0' : '') + (d.getSeconds());
    return d;
}

module.exports = {
    dateToString
};
