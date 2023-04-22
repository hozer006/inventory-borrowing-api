const jwt = require ('jsonwebtoken');
// require('dotenv').config()

//constants
const { JWT_SECRET } = process.env;

module.exports = class Auth {
    static userAuth(req, res, next) {
        let token = req.headers['authorization'];
        // console.log(req.headers);
        if (!token) return res.status(401).send('Access denied. No token provided.');
      
        try {
          // console.log("old" + req.user);
          token = token.split(" ")[1];
          console.log(token);
          const decoded = jwt.verify(token, JWT_SECRET);
          console.log(decoded)
          req.user = decoded;
          next();
        } catch (ex) {
          console.log(ex);
          res.status(400).send('Invalid token.');
        }
    }
  }
  


