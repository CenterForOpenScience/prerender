#!/usr/bin/env node

const prerender = require('prerender');

const server = prerender({
    chromeFlags: [
        // Disable various background network services, including extension updating,
        //   safe browsing service, upgrade detector, translate, UMA
        '--disable-background-networking',
        // Disable installation of default apps on first run
        '--disable-default-apps',
        // https://crbug.com/736452
        '--disable-dev-shm-usage',
        // Disable all chrome extensions entirely
        '--disable-extensions',
        // Disable the GPU hardware acceleration
        '--disable-gpu',
        // Disable syncing to a Google account
        '--disable-sync',
        // Disable the setuid sandbox (Linux only).
        '--disable-setuid-sandbox',
        // Disable built-in Google Translate service
        '--disable-translate',
        // Run in headless mode
        '--headless',
        // Hide scrollbars on generated images/PDFs
        '--hide-scrollbars',
        // Disable reporting to UMA, but allows for collection
        '--metrics-recording-only',
        // Mute audio
        '--mute-audio',
        // Skip first run wizards
        '--no-first-run',
        // Disables the sandbox for all process types that are normally sandboxed.
        '--no-sandbox',
        // Expose port 9222 for remote debugging
        '--remote-debugging-port=9222',
        // Disable fetching safebrowsing lists, likely redundant due to disable-background-networking
        '--safebrowsing-disable-auto-update',
    ],
    chromeLocation: '/usr/bin/google-chrome-unstable',
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
