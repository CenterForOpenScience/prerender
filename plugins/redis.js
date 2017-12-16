const url = require('url');
const redis = require('redis');

const prerenderUtil = require('prerender/lib/util');

module.exports = {
    init() {
        const {
            REDIS_PASSWORD,
            REDIS_HOST = '127.0.0.1',
            REDIS_PORT = '6379',
            REDIS_DB = '0'
        } = process.env;
        
        const {
            REDIS_URL = `redis://${REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : ''}${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
            PAGE_TTL = '86400',
        } = process.env;

        const client = this.client = redis.createClient(REDIS_URL);
        this.redis_online = false;

        const page_ttl_parsed = parseInt(PAGE_TTL);
        this.ttl_options = page_ttl_parsed > 0 ? ['EX', page_ttl_parsed] : [];

        // Catch all error handler. If redis breaks for any reason it will be reported here.
        client.on('error', err => {
            console.error(`Redis Cache Error: ${err.toString()}`);
        });

        client.on('end', err => {
            if (err) {
                console.error(`Redis Cache End Error: ${err.toString()}`);
            }

            this.redis_online = false;
            prerenderUtil.log('Redis Cache Conncetion Closed. Will now bypass redis until it\'s back.');
        });

        client.on('ready', () => {
            this.redis_online = true;
            prerenderUtil.log('Redis Cache Connected');
        });
    },

    requestReceived(req, res, next) {
        // If it's not a GET request, pass it through
        if (!(this.redis_online && req.method === 'GET')) {
            return next();
        }

        this.client.get(req.prerender.url, (err, result) => {
            // Page found - return to prerender and 200
            if (!err && result) {
                res.setHeader('X-Prerender-Redis-Cache', 'HIT');
                return res.send(200, result);
            }

            res.setHeader('X-Prerender-Redis-Cache', 'MISS');
            return next();
        });
    },

    pageLoaded(req, res, next) {
        const {
            statusCode,
            url,
            content,
        } = req.prerender;

        if (!(this.redis_online && statusCode === 200)) {
            return next();
        }

        this.client.set(url, content, ...this.ttl_options, err => {
            if (err) {
                console.error(err);
            }

            return next();
        });
    }
};
