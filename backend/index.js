const express = require("express");
const { connection } = require("./data");
const app = express();
const cors = require("cors");

app.use(express.json());

app.get("/", (req, res) => res.send("Express on Vercel"));
app.use(cors(
  {
    origin: ["https://life-matters.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  }
));

app.get("/user", (req, res) => {
  res.send("life matters");
});

app.listen(8083, () => {
  connection
    .then(() => {
      console.log("db is connected....");
      console.log("server is listening on port 8083....");
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
