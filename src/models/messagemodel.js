
import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({

  
  from: {
    type: String,
    required: true
  },

  
  to: {
    type: String,
    required: true
  },


  text: {
    type: String,
    required: true
  },


  timestamp: {
    type: Date,
    default: Date.now
  },

  direction: {
    type: String,
    enum: ["incoming", "outgoing"],
    required: true
  }
});

export default mongoose.model("Message", MessageSchema);
