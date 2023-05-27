'use strict';

// example: "2023-02-14-12-45-98"
function dateToString(milliseconds) {
    const separator = '-';
    const ms = Number(milliseconds);
    let d = new Date(ms);
    d = d.getFullYear() +
        separator +
        ((1 + d.getMonth() < 10) ? '0' : '') + (1 + d.getMonth()) +
        separator +
        ((d.getDate() < 10) ? '0' : '') + (d.getDate()) +
        separator +
        ((d.getHours()<10) ? '0' : '') + (d.getHours()) +
        separator +
        ((d.getMinutes()<10) ? '0' : '') + (d.getMinutes()) +
        separator +
        ((d.getSeconds()<10) ? '0' : '') + (d.getSeconds());
    return d;
}

module.exports = {
    dateToString,
};
