'use strict';

function funcReturner() {
    return func;
}

function func(request, response, next) {
    if ('html' in response) {
        throw new Error();
    }
    response.html = html;
    next();
}

function html(status, html, contentType) {
    this.status(200);
    if (contentType === undefined) {
        this.set('Content-Type', 'text/html');
    } else {
        this.set('Content-Type', contentType);
    }
    this.send(html);
}

module.exports = funcReturner;
