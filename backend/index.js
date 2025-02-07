const express = require("express");
const router = require("./routes/index");
require('./models/User')
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');

// Disable mongoose debug mode
mongoose.set('debug', false);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
