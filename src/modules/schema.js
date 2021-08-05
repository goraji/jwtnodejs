const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const tSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    password: {
        type: String,
    },
    img:{
        type:String
    }
  })

const Register = new mongoose.model('Register', tSchema);
module.exports = Register;