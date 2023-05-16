const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/User");
const compression = require("compression");

const app = express();

module.exports = app;

app.use(express.json());
// console.log(process.env.PORT);

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("email and password must be provided");
    }

    const userRecord = await User.findOne({ email }).select("+password");
    if (
      !userRecord ||
      !(await userRecord.passwordValidation(password, userRecord.password))
    ) {
      throw new Error("Incorrect email or password", 401);
    }

    req.email = email;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", error: error.message });
  }
};

app.use(compression());

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const user = new User({
      name,
      email,
      password,
      passwordConfirm,
    });

    const newUser = await user.save();

    res
      .status(200)
      .json({ status: "success", message: "user is signed up", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error, message: error.message });
  }
});

app.post("/api/login", authenticate, async (req, res, nex) => {
  try {
    // authenticate(req, res);

    res.status(200).json({ status: "success", message: "user logged in" });
  } catch (error) {
    res.status(401).json({ status: "error", error: error.message });
  }
});

app.put("/api/profile", authenticate, async (req, res) => {
  try {
    const { age, gender, dob, mobile } = req.body;

    const user = await User.findOne({ email: req.email });
    user.age = age;
    user.gender = gender;
    user.dob = dob;
    user.mobile = mobile;

    await user.save({ validateBeforeSave: false });

    res.status(201).json({ status: "success", user });
  } catch (error) {
    res.status(402), json({ status: "error", error: error.message });
  }
});

app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
});
