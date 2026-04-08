exports.middlewareA = function (req, res, next) {
  req.middlewareA = 'OK'
  next()
}

exports.middlewareB = function middlewareB(req, res, next) {
  req.middlewareB = 'OK'
  next()
}