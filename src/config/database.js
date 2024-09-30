const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nijanthan378:wQs7rZiuhhz5m2cE@cluster0.qua2b.mongodb.net/DevTinder"
  );
};

module.exports = { connectToDB };
