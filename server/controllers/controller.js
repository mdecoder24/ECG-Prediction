const fs = require('fs')
const Bcrypt = require('bcrypt')
const Auth = require('../models/authModel')
const { spawn,spawnSync } = require('child_process')
const Profile = require('../models/profileModel')
const History = require('../models/historyModel')
const { createToken } =require('../middlewares/jwtFun')

exports.home = async(req,res) => {
    const auth = req.session.auth
    if(auth)
    {
            const isProfile = await Profile.findOne({_id:auth.userId})
        let result = ''
        let name = ''

            try {
                const filename = req.file.filename
                const { pname } = req.body

                const process = await spawn('python',['./server/middlewares/process.py',filename])
    
                process.stdout.on('data',(data)=>{
                    result = data.toString()
                    req.session.result = {
                    type:'info',
                    pname:pname,
                    msg:data.toString()
                    }
                name = isProfile.fname +' '+isProfile.sname
                const newHistory = History({
                    by:name,
                    role:auth.userRole,
                    email:auth.userEmail,
                    pname:pname,
                    image:filename,
                    result:result
                })
                newHistory.save()
                res.redirect('/')
            })
        } catch (error) {
           res.send(error) 
        }

    }
    else
    {
        req.session.notify = {
            type:'info',
            msg:'Please Login First !',
            link:'login',
            emoji:'👈'
        }
        res.redirect('/')
    }

}

exports.signup = async( req,res ) => {
        try {
            const { email , pass , cpass } = req.body
        
            const isUser = await Auth.findOne({email:email})
    
            if(isUser == null)
            {
    
                if(pass == cpass)
                {
                    const hashpass = await Bcrypt.hash(pass,12)
                    const regEmail = /@email.com|@gmail.com|@yahoo.com|@outlook.com|@ECG.com/i
                    let role = ''
                    const found = email.match(regEmail)
                    if(found == null)
                    {
                        const newUser = Auth({email:email,password:hashpass})
                        newUser.save().then(()=>{
                            
                            res.redirect('/login')
                        })
                    }
                    else
                    {
                        if(found[0] == '@ECG.com')
                        {
                            role = 'Admin'
                            const newUser = Auth({email:email,password:hashpass,role:role})
                            newUser.save().then(()=>{
                                req.session.notify = {
                                    type:'success',
                                    msg:'Signup Successfull !',
                                    link:'login',
                                    emoji:'👈'
                                }
                                res.redirect('/login')
                            })
                        }
                        else
                        {
                            role = 'User'
                            const newUser = Auth({email:email,password:hashpass,role:role})
                            newUser.save().then(()=>{
                                req.session.notify = {
                                    type:'success',
                                    msg:'Signup Successfull !',
                                    link:'login',
                                    emoji:'👈'
                                }
                                res.redirect('/login')
                            })
                        }
                    }
                }
                else
                {
                    req.session.notify = {
                        type:'danger',
                        msg:'Password Did not match !'
                    }
                    res.redirect('/signup')
                }
        }
        else
        {
            req.session.notify = {
                type:'info',
                msg:'User alredy Exist ! use new email or go to',
                link:'login',
                emoji:'👈'
            }
            res.redirect('/signup') 
        }
        } catch (error) {
            console.log(error)
        }
} 

exports.login = async( req,res ) => { 
        const { email,pass } = req.body

        const isUSerExist = await Auth.findOne({email:email})

            if( isUSerExist == null)
            {
                req.session.notify = {
                    type:'info',
                    msg:'Sorry User Does Not Exist !',
                    emoji:'💔'
                }
                res.redirect('/')
            }
            else
            {
                const match = await Bcrypt.compare(pass,isUSerExist.password)
                if(match)
            {
                const Token = createToken(isUSerExist)
                res.cookie("access-Token",Token,{maxAge:60*60*24*30*1000,httpOnly:true})
                req.session.notify = {
                    type:'success',
                    msg:'Logged In Successfully',
                    emoji:'🎉'
                }
                res.redirect('/profile')
            }
            }
}
     
exports.profile = async( req,res ) => {
    if(!req.session.auth)
    {
        res.redirect('/login')
    }
    else
    {
        try {
            const { id, fname, sname, gender, profession,email,role  } = req.body
            const profile = req.file.filename
    
            const newProfile = Profile({
                    _id:id,
                    fname:fname,
                    sname:sname,
                    email:email,
                    role:role,
                    gender:gender,
                    profession:profession,
                    image:profile
            })
            newProfile.save().then(()=>{
                req.session.notify = {
                    type:'success',
                    msg:'Profile Created Successfully !',
                    emoji:'🎉'
                }
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }
    

    



}

exports.updateprofile = async( req,res ) => {
    if(!req.session.auth)
    {
        res.redirect('/login')
    }
    else
    {
        try {

            const { id,fname,sname,gender,profession} = req.body
        let new_image = ''
    
        if(req.file)
        {
            new_image = req.file.filename
            try {
                fs.unlinkSync('./assets/img/uploads/'+req.body.old_image)
            } catch (error) {
                console.log(error)
            }
        }
        else
        {
            new_image = req.body.old_image
        }
    
        Profile.findByIdAndUpdate(id,{
            fname:fname,
            sname:sname,
            gender : gender,
            profession : profession,
            image : new_image
        }).then(()=>{
            req.session.notify = {
                type:'success',
                msg:'Profile Updated Successfully !',
                emoji:'🎉'
            }
            res.redirect('/updateprofile')
        })
            
        } catch (error) {
            console.log(error)
        }
    }      
}

exports.logout = async(req,res)=>{
    try {
    res.clearCookie("access-Token")
    req.session.notify = {
        type:'success',
        msg:'Profile Updated Successfully !',
        emoji:'🎉'
    }
    req.session.destroy()
    res.redirect('/')
    } catch (error) {
        res.send(error)
    }
}
