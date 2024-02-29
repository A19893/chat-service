const mongoose = require("mongoose");

 const connectWithDataBase = async () => {
  mongoose
    .connect(
      process.env.MONGO_URL,
    )
    .then(() => {
      console.log("Connection to the database is successful".cyan.underline);
    })
    .catch((error) => {
      console.error("Connection Error:", error);
    });
};


connectWithDataBase();
