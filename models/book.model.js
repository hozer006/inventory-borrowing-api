const moment = require('moment-timezone');
const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.ObjectId;

const Book = mongoose.model(
  "Book", new mongoose.Schema({
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
    },
    imageUrl: {
      type: String,
    },
    // createdAt: {
    //   type: Date,
    // },
    createdBy: {
      type: ObjectId, 
      ref: "User",
    },
    // updatedAt: {
    //   type: Date,

    // },
    updatedBy: {
      type:  mongoose.Schema.ObjectId, 
      ref: "Book",
    },
    // deletedAt: {
    //   type: Date,
    // },
    deletedBy: {
      type: ObjectId, 
      ref: "Book",
    },
    
  }, {timestamps : true} 
  )
);

module.exports =  Book;

