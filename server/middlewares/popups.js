exports.notify = (req,res,next) => {
    res.locals.notify = req.session.notify
    delete req.session.notify
    next()
}

exports.result = (req,res,next) => {
    res.locals.result = req.session.result
    delete req.session.result
    next()
}