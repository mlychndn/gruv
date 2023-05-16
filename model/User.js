const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    minLength: [5, "length of name should be equal or greater than 5 chars"],
    maxLength: [40, "lenght of name should not be greater than 40 chars"],
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email should be valid"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLenght: [
      8,
      "password length should be greater or equal than 8 characters",
    ],
    maxLength: [20, "Password lenght should not be greater than 20 chars"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must enter a passwordConfirm"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password and passwordConfirm should be same",
    },
  },
  age: Number,
  gender: {
    type: String,
    // required: [true, "please provide your gender"],
    enum: {
      values: ["Male", "Female"],
      message: "Gender will be either male or female",
    },
  },
  dob: Date,
  mobile: {
    type: Number,
    minLength: [10, "length should always be equal to 10"],
    maxLength: [10, "length should always be equal to 10"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
      this.passwordConfirm = undefined;
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
});

userSchema.post("save", function (next) {
  console.log("passwoerd is hashed using bcrypt");
});

userSchema.methods.passwordValidation = async function (
  userInputPass,
  userSavedPass
) {
  return await bcrypt.compare(userInputPass, userSavedPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
