const express = require("express");
const connectDB = require("./config/db");

const developmentRoutes = require("./routes/developmentRoutes");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to connect to the database. Server not started.",
      error
    );
  });

app.use(developmentRoutes);
