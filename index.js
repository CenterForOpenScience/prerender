#!/usr/bin/env node

const prerender = require('prerender');
const fs = require('fs');

const server = prerender({
    chromeFlags: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--hide-scrollbars',
    ],
});

for (const filename of fs.readdirSync('./plugins')) {
    if (!/\.js$/.test(filename))
        continue;

    server.use(require(`./plugins/${filename}`));
}

server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

if (process.env.ALLOWED_DOMAINS) {
    server.use(prerender.whitelist());
}

server.start();
