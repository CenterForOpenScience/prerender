module.exports = {
  requestReceived: (req, res, next) => {
    const localRegex = /^http:\/\/(127\.0\.0\.1|localhost)/;
    const {url} = req.prerender;
    if (localRegex.test(url)) {
      res.send(200)
    } else {
      next();
    }
  }
}
