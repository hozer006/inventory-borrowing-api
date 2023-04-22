const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");
const { json } = require("body-parser");
const mongoose = require("mongoose");
const db = require("../models/");
const jwt = require("jsonwebtoken");
const { user } = require("../models/");
const User = db.user;

// require("dotenv").config();
const { JWT_SECRET } = process.env;

// User.methods.generateAuthToken = function() {
//   const token = jwt.sign({ _id: this._id, email: this.email, userName: this.userName }, JWT_SECRET);
//   return token;
// };

module.exports = class UserController {

  static async createUser(req, res, next) {
    
    try {
      const errors = validationResult(req);
      const { firstname, lastname, email, password, roles} = req.body;
      
      // const createdById = req.user._id;

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      let olduser = await User.findOne({ email });
      if (olduser)
        return res.status(409).send({ message: "User already registered." });

      const encryptedPassword = await bcrypt.hash(password, 10);
      // let roles_ = await User.find({  }).select('roles');
      // roles_  =  roles_[0]
        // let set ;
  //   if(roles_[0].roles == 'user') {
  //     console.log(roles_)
  //      console.log("admin")
  //      var set = 'admin'
  //   }else if(roles_[0].roles == 'admin'){
  //     console.log(roles_)
  //     console.log("user")
  //     var set = 'user'
  //   }else {
  //     var set = "admin"
  //   }

  //  }


      const user = await User.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: encryptedPassword,
        // roles: setadmin
        // createdBy: createdById,
      });

      
      const token = jwt.sign(
        {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      user.token = token;

      // await user.save();

      res.status(201).send({
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          token: user.token,
        },
        message: "Successfully registered",
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { userId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).send({ message: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send({ message: "Invalid password." });

      const token = jwt.sign(
        {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.roles,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      user.token = token;

      const refreshToken = jwt.sign(
        {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.roles,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      if (token != { expiresIn: "2h" }) {
        user.token = refreshToken;
      }
      res
        .status(200)
        .send({
          data: {
            firstname: user.firstname,
            lesttname: user.lastname,
            role: user.roles,
            token,
          },
          message: "Login successful.",
          isLoggedIn: true,
        });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }

  static async logoutUser(req, res) {
    try {
      console.log(token);
      if (user.token == token) {
        user.token = null;
      }
      return res.status(200).send({
        message: "You've been signed out!",
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }
};
