const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");
const mongoose = require("mongoose");

const db = process.env.URL.replace("<PASSWORD>", process.env.PASSWORD);

// mongodb connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection succesful ❤️");
  })
  .catch((err) => {
    console.log(`error is ${err.message}`);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
