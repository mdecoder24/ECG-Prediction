const mongoose = require('mongoose')

const date = new Date

const today = date.toLocaleString('en-US',{
    day:'numeric',
    month:'short'
})

const time = date.toLocaleString('en-US',{
    hour:'2-digit',
    minute:'2-digit'
})

const authSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:'Dr'
    },
    createdOn:{
        type:String,
        required:true,
        default:today
    },
    createdAt:{
        type:String,
        required:true,
        default:time
    }
})

const Auth = mongoose.model('auth',authSchema)

module.exports = Auth
