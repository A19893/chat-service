require("dotenv").config();
require("colors");
const express = require("express");
const cors = require("cors");
const { userRoutes, chatRoutes, messageRoutes } = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();

app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));

require("./config/dbConfig");

app.use("/api/user", userRoutes);
app.use('/api/chats', chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(process.env.APP_PORT, function () {
  console.log(
    `Server is listening on port  ${process.env.APP_PORT}`.yellow.bold
  );
});
