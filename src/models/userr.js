import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  
  phone: {
    type: String
  },

  
  name: {
    type: String
  },

  
  lastSeen: {
    type: Date
  },


  isHumanHandoff: {
    type: Boolean,
    default: false
  }

});


export default mongoose.model("User", UserSchema);
