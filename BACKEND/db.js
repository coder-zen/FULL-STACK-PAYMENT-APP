const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDb is connected");

    } catch (error) {
        console.log("Database error : ", error);
        process.exit(1);
    }

}


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 100
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },

    token: {
        type: String
    }

})

const User = mongoose.model("User", userSchema); // this is mmy data base mongoose model no need to export the useSchema
module.exports = {
    User,
    connectDb
}