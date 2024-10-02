const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const developmentRoutes = require("./routes/developmentRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", developmentRoutes);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to connect to the database. Server not started.",
      error
    );
  });

module.exports = app;
