// const mongoose  =require("mongoose");

// const userSchema = new mongoose.Schema({
//     username: { 
//         type: String,
//         required: true, 
//         unique: true 
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         required: true,
//         enum: ["admin", "lawyer", "client"],
//     }
    

// },
// {
//     timestamps: true,
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "lawyer", "client"] },
    
    // Personal Information
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    bio: { type: String },
    profileImage: { type: String }, // URL to Cloudinary

    // Professional Information (For Lawyers/Admins)
    barNumber: { type: String },
    expertise: [{ type: String }], // e.g., ["Corporate Law", "Contract Law"]
    yearsOfPractice: { type: Number, default: 0 },
    casesWon: { type: Number, default: 0 }
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);