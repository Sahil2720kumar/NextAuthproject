import mongoose,{Schema} from "mongoose"

const userSchema=new Schema({
  name:{
    type:String,
    required:[true,"name is required !"],
  },
  email:{
    type:String,
    required:[true,"email is required !"],
    unique:true,
    trim:true,
  },
  password:{
    type:String,
    required:false,
  },
  avatar:{
    type:String,
    required:false
  },
  role:{
    type:String,
    required:false,
    default:"User"
  },
  password_reset_token:{
    type:String,
    required:false,
    trim:true
  },
  magic_link_token:{
    type:String,
    required:false,
    trim:true
  },
  magic_link_send_at:{
    required:false,
    type:Date
  }
})

export const User = mongoose.models.users || mongoose.model("users",userSchema)