module.exports = {
    tabCreated(req, res, next) {
        const {
            THROTTLE_TOKEN,
        } = process.env;

        if (THROTTLE_TOKEN) {
            req.prerender.tab.Network.setExtraHTTPHeaders({
                headers: {
                    'X-THROTTLE-TOKEN': THROTTLE_TOKEN
                }
            });
        }

        next();
    }
};
