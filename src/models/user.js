const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: function (value) {
        return value.replace(/\s+/g, ""); // Removes all spaces within the email
      },
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak, Try something different");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not defined`,
      },
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid details");
        }
      },
    },
    profilePic: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/stylish-default-user-profile-photo-avatar-vector-illustration_664995-352.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid image URL");
        }
      },
    },
    about: {
      type: String,
      default: "The bio of the user goes here !!!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1 });
userSchema.index({ email: 1, password: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "thisISsPrivateKey", {
    expiresIn: "7d", // TOKEN EXPIRES IN 7 DAYS
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
