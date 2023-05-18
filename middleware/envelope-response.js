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

    if (json) {
        this.json(json);
        return;
    }
    switch (json) {
    case 401:
        this.json({ message: 'Not authorized.' });
        break;
    case 500:
        this.json({ message: 'Internal server error.' });
        break;
    default:
        this.json({});
    }
}

module.exports = funcReturner;
