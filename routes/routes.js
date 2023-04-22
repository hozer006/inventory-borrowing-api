const express = require ("express");
const multer = require("multer");

const UserController = require ("../controllers/user.controller");
const BookController = require ("../controllers/book.controller");
const { validate } = require ('../middleware/validator');
const Auth = require ('../middleware/auth');
const uploadFilesMiddleware = require ("../middleware/imageResize");

const { createUser, loginUser,logoutUser } = UserController;
const { createBook, fetchBooks, updateBook, deleteBook, deleteBookAll, fetchBookID } = BookController;
const  { userAuth }  = Auth;



const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const routes = (app) => {
  //user routes
  app.route("/api/user/register").post(validate('userRegistration'), createUser);
  app.route("/api/user/login").post(validate('userLogin'), loginUser);
  app.route("/api/user/logout").post(logoutUser);

  //Book routes upload.single('image'), uploadFilesMiddleware,
  app.route("/api/books").get(userAuth, fetchBooks);
  app.route("/api/books/:bookId").get(userAuth, fetchBookID);
  app.route("/api/books/:bookId").get(userAuth, fetchBookID);
  app.route("/api/books/upload").post(userAuth, upload.single('file'), uploadFilesMiddleware);
  app.route("/api/books").post(userAuth, createBook);
  app.route("/api/books/:bookId").patch(validate('bookCreation'), userAuth, updateBook);
  app.route("/api/books/:bookId").delete(userAuth, deleteBook);
  app.route("/api/books").delete(userAuth, deleteBookAll);
  return app;
};

module.exports = routes;


