const mongoose = require('mongoose')

const date = new Date

const uploadedOn = date.toLocaleString('en-US',{
    day:'2-digit',
    month : 'short',
    hour : '2-digit',
    minute : '2-digit'
})

const historySchema = new mongoose.Schema({
    by : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required:true
    },
    email:{
        type : String,
        required : true
    },
    pname : {
        type : String,
        default : null
    },
    image : {
        type : String,
        required : true
    },
    result : {
        type : String,
        required : true
    },
    uploadedOn : {
        type : String,
        required : true,
        default : uploadedOn
    }
})

const History = mongoose.model('history',historySchema)

module.exports = History