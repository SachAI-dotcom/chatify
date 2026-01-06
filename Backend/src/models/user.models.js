import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        default: null,
    },
    accessToken:{
        type: String,
        default: null,
    },
},
{timestamps: true}
);
userSchema.methods.isPasswordCorrect = async function(password) {
    return bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        id: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET || process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};
const User = mongoose.model('User', userSchema);

export default User;