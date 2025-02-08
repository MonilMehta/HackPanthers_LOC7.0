import mongoose, { Schema } from "mongoose"; 

const citizenScehma = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    fullname:{
        type:String,
        required: true
    },
    email:{
      type:String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone_no: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    
})