import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userame:{
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
userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
const User = mongoose.model('User', userSchema);

export default User;