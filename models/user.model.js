const moment = require('moment-timezone');
const mongoose = require("mongoose");
const jwt = require ("jsonwebtoken");
// require('dotenv').config()

const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");

const { JWT_SECRET } = process.env


 


 const User = mongoose.model(
  "User",
  new mongoose.Schema({

    firstname: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    lastname: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 30,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    token: { type: String },
    roles: {
      type: String,
      default: "user"
    },
    createdAt: {
      type: Date,
      default: dateThailand
    },
    createdBy: {
      type: ObjectId, 
      ref: "User",
      default: null
    }
  }, {timestamps : true}  
  )
);


// const token = jwt.sign({ _id: this._id, email: this.email, firstname: this.firstnam, lastname: this.lastname }, JWT_SECRET);
module.exports = User;



