const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name should not be empty");
  } else if (firstName.length == 0 || firstName.length <= 2) {
    throw new Error("Name should be at lease more than 2");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak");
  }
};

module.exports = { signUpValidation };
