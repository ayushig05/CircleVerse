require('dotenv').config();
const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URI}`);
        console.log("Connected to MongoDB Successfully");
    } catch (error) {
        console.log(error);   
    }
};

conn();
