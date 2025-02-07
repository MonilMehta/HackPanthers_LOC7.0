const mongoose = require("mongoose");
require('dotenv').config();

mongoose.set("debug", true);

const uri = process.env.MONGO_URI;


mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Could not connect to MongoDB:");
        console.error(err.message);
    });
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
});



const User = mongoose.model("User", UserSchema);

module.exports = User;  // Changed to export User directly