
const { sign , verify } = require('jsonwebtoken')
const TSECRET = process.env.TSECRET

exports.createToken = (auth)=>{
    const accessToken = sign({
        userId:auth._id,
        userEmail:auth.email,
    userRole:auth.role
},TSECRET)
    return accessToken
}

exports.validateToken = (req,res,next)=>{
    const accessToken = req.cookies['access-Token']
    if(!accessToken){
        req.session.notify = {
            type:'warning',
            msg:'You are not authorized !',
            emoji:'❌'
        }
        res.redirect('/login')
    }
    else
    {
        const verifiedToken = verify(accessToken,TSECRET)
        if(verifiedToken)
        {
            req.session.auth = verifiedToken
            return next()
        }
    }
    
}