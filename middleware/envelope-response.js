'use strict';

function funcReturner() {
    return func;
}

function func(request, response, next) {
    if ('envelope' in response) {
        throw new Error();
    }
    response.envelope = envelope;
    next();
}

function envelope(status, json) {
    this.status(status);
    if (json !== undefined) {
        this.json(json);
    } else {
        this.json({});
    }
}

module.exports = funcReturner;
