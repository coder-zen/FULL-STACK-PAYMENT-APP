require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const app = express();
const cors = require('cors');
const { connectDb } = require("./db");


app.use(cors());
app.use(express.json()); // middleware to parse the json;
const mainRouter = require("./Routes/index");

app.use("/api/v1/", mainRouter);  // any router witht the /user comes to


connectDb();

port = 3000;
app.listen(port, () => {
    console.log("app is runnig of the server : ", port, "");

})