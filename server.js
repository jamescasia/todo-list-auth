const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
const port = process.env.PORT;

mongoose.connect(uri, {
    useNewUrlParser: true,
    autoIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully!");
});

const usersRouter = require("./routes/users");
app.use("/", usersRouter);

app.listen(port, () => {
    console.log(`Auth Server is running on port ${port}`);
});