const Profile = require('../models/profileModel')
const History = require('../models/historyModel')
const jwt = require('jsonwebtoken')
const TSECRET = process.env.TSECRET

exports.home = async(req,res)=>{
    const auth = req.session.auth
    let isProfile
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth.userId})
    }
    res.render('index',{title:"ECG | Home ",auth:auth,profile:isProfile})   
}

exports.login = async(req,res)=>{
    if(req.session.auth)
    {
        res.redirect('/')
    }
    else
    {
        res.render('login',{title:"ECG | Login"})
    }
        
}

exports.signup = async(req,res)=>{
    if(req.session.auth)
    {
        res.redirect('/')
    }
    else
    {
    res.render('signup',{title:"ECG | Signup"})
    }
}
        
exports.profile = async(req,res)=>{
    if(!req.session.auth)
    {
        res.redirect('/login')
    }
    else
    {
        const auth = req.session.auth
    const isProfileExist = await Profile.findOne({_id:auth.userId})
    if(isProfileExist)
    {
        req.session.notify = {
            type:'success',
            msg:'Logged In Successfully',
            emoji:'🎉'
        }
        res.redirect('/')
    }
    else
    {
        res.render('profile',{title:"ECG | Profile",auth:auth})
    }
    }
    
}

exports.updateprofile = async( req,res )=>{
    if(!req.session.auth)
    {
        res.redirect('/login')
    }
    else
    {
    const auth = req.session.auth
    const foundProfile = await Profile.findOne({_id:auth.userId})
    res.render('updateprofile',{title:"ECG | Update Profile",profile:foundProfile})
    }
}

exports.history = async(req,res) => {
    const auth = req.session.auth
    let isProfile,allhistory,hcount
    if(req.query.email)
    {
        const email = req.query.email
        isProfile = await Profile.findOne({email:email})
        hcount = await History.find({email:email}).count()
        allhistory = await History.find({email:email})
        res.render('history',{title:"ECG | History",auth:auth,hcount:hcount,History:allhistory,profile:isProfile})
    }
    else
    {
        if(auth.userRole == 'Admin')
        {
            isProfile = await Profile.findOne({email:auth.userEmail})
        hcount = await History.find({$or:[
            { role:"User"},
            { role:"Dr"}] }).count()
        allhistory = await History.find({$or:[
            { role:"User"},
            { role:"Dr"}] })
        res.render('history',{title:"ECG | History",auth:auth,hcount:hcount,History:allhistory,profile:isProfile})
        }
        else
        {
            res.redirect('/')
        }  
    }
    
}

exports.ip = async( req,res )=>{
    const auth = req.session.auth
    let isProfile
    isProfile = await Profile.findOne({_id:auth.userId})
    res.render('ip',{title:"ECG | Pre-Preocessing",auth:auth,profile:isProfile})
}

exports.delete = async( req,res ) => {
    const auth = req.session.auth
    if(auth)
    {
        const { id } = req.params
        await History.findOneAndDelete({_id:id})
        req.session.notify = {
            type:'success',
            msg:'Deleted Successfully',
            emoji:'❌'
        }
        res.redirect(`/history?email=${auth.userEmail}`)
    }
    
}

exports.admin = async( req,res ) => {
    auth = req.session.auth
    let isProfile,tuser,thist,allProfile
    let ncount,hmiCount,abCount,miCount
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth.userId})
        tuser = await Profile.find({$or:[
            { role:"User"},
            { role:"Dr"}
         ]}).count()
        thist = await History.find({$or:[
            { role:"User"},
            { role:"Dr"}
         ]}).count()
        ucount = await Profile.find({role:'User'}).count()
        dcount = await Profile.find({role:'Dr'}).count()
        ncount = await History.find({result:'Your ECG is Normal\r\n'}).count()
        hmiCount = await History.find({result:'Your ECG corresponds to History of Myocardial Infarction\r\n'}).count()
        abCount = await History.find({result:'Your ECG corresponds to Abnormal Heartbeat\r\n'}).count()
        miCount = await History.find({result:'Your ECG corresponds to Myocardial Infarction\r\n'}).count()

    }
    res.render('admin',{title:"ECG | Admin Panel",auth:auth,profile:isProfile,tusers:tuser,thist:thist,ucount:ucount,dcount:dcount,ncount:ncount,hmiCount:hmiCount,abCount:abCount,miCount:miCount})
}

exports.allprofile = async( req,res ) =>{
    const auth = req.session.auth
    let isprofile,all,alluser
    if(auth.userRole == 'Admin')
    {
        isprofile = await Profile.findOne({_id:auth.userId})
        all = req.query.all
        if(all)
        {
            alluser = await Profile.find({role:all})
            res.render('allprofile',{title:`ECG | ALL ${all}'s`,auth:auth,allu:alluser,profile:isprofile,all:all})
        }
        else
        {
            alluser = await Profile.find({$or:[
                { role:"User"},
                { role:"Dr"}]})
            all = await Profile.find({$or:[
                { role:"User"},
                { role:"Dr"}]}).count()
            res.render('allprofile',{title:"ECG | All Profile",auth:auth,allu:alluser,profile:isprofile,all:all})
        }
    }
    else
    {
        res.redirect('/')
    }
}

exports.allprediction = async( req,res ) =>{
    const auth = req.session.auth
    let isprofile,pdata
    if(auth.userRole == 'Admin')
    {
        isprofile = await Profile.findOne({_id:auth.userId})
        all = req.query.all
        if(!all)
        {
            ptotal = await History.find().count()
            pdata = await History.find({})
            res.render('allprediction',{title:"ECG | All Prediction",allp:pdata,profile:isprofile,auth:auth,ptotal:ptotal})
        }
    }
    else
    {
        res.redirect('/')
    }
}

exports.x404 = async( req,res )=>{
    if(req.session.auth)
    {
        res.redirect('/')
    }
    else
    {
        res.render('404',{
            title:"ECG | Error"
        })
    }
}
