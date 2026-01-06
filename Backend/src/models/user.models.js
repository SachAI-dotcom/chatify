import mongoose from "mongoose";

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

const User = mongoose.model('User', userSchema);

export default User;