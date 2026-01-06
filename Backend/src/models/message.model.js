import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);

export default Message;