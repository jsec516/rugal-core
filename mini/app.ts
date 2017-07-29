var express = require('express');
export function setupParentApp() {
    var app = express();
    app.get('/test', function(req, res) {
        res.send('fine');
    })

    return app;
}