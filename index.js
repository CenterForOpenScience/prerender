#!/usr/bin/env node

const prerender = require('prerender');

const server = prerender({
    chromeFlags: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--hide-scrollbars',
    ],
});

if (process.env.ALLOWED_DOMAINS) {
    server.use(prerender.whitelist());
}

server.use(require('./plugins/throttleToken'));
server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(require('./plugins/redis'));

server.start();
