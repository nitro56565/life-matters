const express = require("express");
const connection = require("./data");
const app = express();
app.use(express.json());
app.get("/user", (req, res) => {
  res.send("life matters");
});
app.listen(8083, async (req, res) => {
  await connection;
  console.log("db is conncected....");
  console.log("server is listeining....");
});
