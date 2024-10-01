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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "profilePic",
    "age",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) => {
    return allowedEditFields.includes(key);
  });

  return isEditAllowed;
};

const passwordValidation = (req) => {
  const { password } = req.body;
  if (!password || password.length < 5) {
    throw new Error(
      "Password field cannot be empty and should more than 5 characters"
    );
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password looks weak, Try other password");
  }
};

module.exports = {
  signUpValidation,
  validateEditProfileData,
  passwordValidation,
};
