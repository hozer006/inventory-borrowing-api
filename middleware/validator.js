const { body } = require ("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "userRegistration": {
      return [
        body(
          "firstname",
          `User fistname is required and should have atleast 5 characters`
        )
          .exists()
          .trim()
          .isLength({ min: 5 }),
          body(
            "lastname",
            `User fistname is required and should have atleast 5 characters`
          )
            .exists()
            .trim()
            .isLength({ min: 5 }),
        body("email", "Email is required and should be valid")
          .exists()
          .isEmail()
          .trim()
          .isLength({ min: 5 }),
        body(
          "password",
          "Password is required and should have atleast 5 characters"
        )
          .exists()
          .trim(),
      ];
    }
    case "userLogin": {
      return [
        body("email", "Email is required and should be valid")
          .exists()
          .isEmail()
          .trim()
          .isLength({ min: 5 }),
        body(
          "password",
          "Password is required and should have atleast 5 characters"
        )
          .exists()
          .trim(),
      ];
    }
    case "bookCreation": {
      return [
        body("bookName", `bookName is required`).exists().trim(),
        body(
          "author",
          "Author is required and should have atleast 5 characters"
        )
          .exists()
          .trim()
      ];
    }
    default:
      return null;
  }
};
