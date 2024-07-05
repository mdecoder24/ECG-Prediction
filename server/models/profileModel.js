const mongoose = require('mongoose')

const date = new Date

const updatedOn = date.toLocaleString('en-US',{
    day:'2-digit',
    month : 'short',
    hour : '2-digit',
    minute : '2-digit'
})

const profileSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    fname : {
        type : String,
        required : true
    },
    sname : {
        type : String,
        required : true
    },
    role : {
        type:String,
        required:true
    },
    email : {
        type :String,
        required:true
    },
    gender : {
        type : String,
        required : true
    },
    profession : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    updatedOn : {
        type : String,
        required : true,
        default : updatedOn
    }
})

const Profile = mongoose.model('profile',profileSchema)

module.exports = Profile