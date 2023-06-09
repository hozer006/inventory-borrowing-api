const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");

exports.signup = (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    createdAt: new Date()
  });

  

  user.save((err, user) =>  {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    

    res.status(200).send("User Content.");
  });
  

};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        email: user.email,
        roles: user.role,
        create: user.createdAt,
        accessToken: token
      });
    });
};


