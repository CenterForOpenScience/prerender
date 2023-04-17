#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    chromeLocation: '/usr/bin/chromium-browser',
    chromeFlags: [ '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars' ]
});

// server.use(require('./lib/plugins/throttleToken'));
// server.use(prerender.sendPrerenderHeader());
// server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());
// server.use(prerender.addMetaTags());
server.use(require('prerender-aws-s3-cache'))
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
