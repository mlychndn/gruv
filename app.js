const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/User");
const compression = require("compression");

const app = express();

module.exports = app;

app.use(express.json());
// console.log(process.env.PORT);

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

app.post("/api/login", async (req, res) => {
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
    res.status(200).json({ status: "success", message: "user logged in" });
  } catch (error) {
    res.status(401).json({ status: "error", error: error.message });
  }
});

app.put("/api/profile", async (req, res) => {
  const { user } = req;
  const { age, gender, dob, mobile } = req.body;
  user.age = age;
  user.gender = gender;
  user.dob = dob;
  user.mobile = mobile;
  try {
    await user.save();
    res.status(200).send("Profile updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("Profile update failed");
  }
});
