const { verify } = require('jsonwebtoken')
const TSECRET = process.env.TSECRET

exports.isValidRoute = (req,res,next)=>{
    const accessToken = req.cookies['access-Token']
    if(!accessToken)
    {
        return next()
    }else
    {
        const verifiedToken = verify(accessToken,TSECRET)
        req.session.auth = verifiedToken
        res.redirect('/')
    }
}