'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require("cors");
app.use(cors({optionSuccessStatus: 200})); // some legacy browsers choke on 204

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.urlencoded({extended: false}));

const links = [];
const urlPattern = /^http(s?):\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\S*$/;
app.post('/api/shorturl/new', function (request, response) {
    const url = request.body.url || null;

    if (url && urlPattern.test(url)) {
        dns.lookup(url.split('/')[2], (error, address, family) => {
            if (error) {
                response.json({
                    error: "invalid URL"
                });
            } else {
                const existingRecord = links.filter((link) => (link.original === url))[0] || null;
                if (existingRecord) {
                    response.json({
                        original_url: existingRecord.original,
                        short_url: existingRecord.shortened
                    });
                } else {
                    const link = {
                        original: url,
                        shortened: (links.length + 1)
                    };
                    links.push(link);
                    response.json({
                        original_url: link.original,
                        short_url: link.shortened
                    });
                }
            }
        });
    } else {
        response.json({
            error: "invalid URL"
        });
    }
});

app.get('/api/shorturl/:shortened', function (request, response) {
    const shortened = parseInt(request.params.shortened) || -1;
    const existingRecord = links.filter((link) => (link.shortened === shortened))[0] || null;

    if (existingRecord) {
        response.redirect(existingRecord.original);
    } else {
        response.json({
            error: 'No short url found for given input'
        });
    }
});

const listener = app.listen(process.env.PORT || 5000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});
