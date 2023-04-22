const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const uploadToCloudinary = require ("../utils/cloudinary");

const db = require("../models");
const { book } = require("../models");
const moment = require("moment-timezone");

var timeString = "Asia/Bangkok";
var dateThailand = moment.tz(new Date(), timeString);

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const outputFolder = "uploads";

const Book = db.book;

const { JWT_SECRET } = process.env;

module.exports = class BookController {
  static async fetchBooks(req, res) {
    console.log("fetchBooks");

      const bookName = req.query.bookName;
      var test =  bookName ? { bookName: { $regex: new RegExp(bookName), $options: "i" } } : {};
      console.log(test);
      const books = await Book.find(test).sort({ _id: -1 }).populate("createdBy")   .then(data => {
        res.status(200).send( data );
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
      // books.createdBy instanceof ObjectId;
  


      // res.status(500).send(error.message);
    
  }

  static async fetchBookID(req, res) {
    console.log("fetchBooksID");
    const { bookId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ message: `Invalid book ID` });
      }

      const book = await Book.findById(bookId);
      res.status(200).send({ book });

      // const token = req.headers["authorization"];
      // const user = jwt.verify(token, JWT_SECRET);

      // console.log(user)
      // const books = await Book.find({ userId: user._id }).sort({ _id: -1 });
      // // console.log(books)
      // res.status(200).send(books);

      // /* Not doing anything. */
      // res.status(200).send(books);
    } catch (error) {
      // console.log(error)
      res.status(500).send(error.message);
    }
  }

  static async createBook(req, res) { 

    try {
      console.log("createBook");
      const { bookName, author , path} = req.body;
      const createdById = req.user._id;
      const imagePath = req.file;
      console.log(imagePath)

      let book = await Book.findOne({ bookName });
      if (book)
        return res.status(409).json({
          message: `Book with ${bookName} already exists`,
        });

        // let imageUrl = ''
        // const newPath = await uploadToCloudinary(imagePath)
        // imageUrl = newPath.url

      let newBook = await Book.create({
        bookName,
        author,
        imageUrl : path,
        createAt: Date.now(),
        createdBy: createdById,
      });


      const token = jwt.sign(
        {
          _id: newBook._id,
          bookName: newBook.bookName,
          author: newBook.author,
          imageUrl: newBook.imageUrl,
          createdBy: newBook.createdBy,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      /* Not doing anything. */
      newBook.token = token;
      console.log(newBook.token);
      // const savedBook = await newBook.save();
      res.status(201).send({
        data: {
          id: newBook._id,
          bookName: newBook.bookName,
          author: newBook.author,
          imageUrl: newBook.imageUrl,
          createdBy: newBook.createdBy,
          token: newBook.token,
        },
        status: "Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ Error: error.message });
    }
  }

  static async updateBook(req, res) {
    try {
      const { bookName, author, updatedBy } = req.body;
      const updatedById = req.user._id;
      const { bookId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ message: `Invalid book ID` });
      }

      const book = await Book.findByIdAndUpdate(
        bookId,
        {
          bookName,
          author,
          updatedAt: dateThailand + 7,
          updatedBy: updatedById,
          // image
        },
        { new: true }
      );
      const savedBook = await book.save();

      if (!book) {
        return res
          .status(404)
          .send({ message: `Book with ID ${bookId} was not found` });
      }

      res.status(200).send({ data: savedBook, status: "Success" });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }

  static async deleteBook(req, res) {
    const { bookId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ message: `Invalid book ID` });
      }
      const book = await Book.findByIdAndRemove(bookId);

      if (!book)
        return res
          .status(404)
          .send({ message: `Book with ID ${bookId} was not found` });

      res.status(200).send({
        message: `Book with ID ${bookId} deleted successfully`,
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }

  static async deleteBookAll(req, res) {
    try {
      await Book.deleteMany({});
      res.status(200).send({
        message: `Book deleted successfully`,
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }
};
