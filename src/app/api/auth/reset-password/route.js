import {connectToDB} from "@/utils/database"
import {nextRequest,nextResponse} from "next/server"
import vine,{errors} from "@vinejs/vine"
import {resetPasswordSchema} from "@/validators/authSchema"
import ErrorReporter from "@/validators/errorReporter"
import {User} from "@/models/user"
import cryptoRandomString from 'crypto-random-string';
import Cryptr  from 'cryptr'
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectToDB()
    const body = await request.json()
    console.log(body)
    const validator=vine.compile(resetPasswordSchema)
    validator.errorReporter = () => new ErrorReporter()
    const output=await validator.validate(body)
    console.log(output)
    
    //* decrypt user email
    const crypt=new Cryptr(process.env.SECRET_KEY)
    const decryptEmail=crypt.decrypt(output.email)
    console.log("decrypt email :"+decryptEmail)
    
    const user=await User.findOne({email:decryptEmail,password_reset_token:output.signature})
    if(user){
      console.log("password:",user.password)
      user.password=bcrypt.hashSync(
        output.password,
        parseInt(process.env.BCRYPT_SALT)
      )
      console.log("password(agian):",user.password)
      user.password_reset_token=null
      await user.save()
      console.log("im here 2")
      return nextResponse.json({
        status:200,
        message:"password change successfully."
      },{
        status:200
      })
    }else{
      return nextResponse.json({
        status:400,
        message:"reset url is not correct, please double check it."
      },{
        status:200
      })
    }
    
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
         // array created by SimpleErrorReporter
         console.log(error.messages)
         //return nextResponse.json(error.messages,{status:400})
         return nextResponse.json({
            status:400,
            errors:error.messages
          },{status:400})
    }
  }
}

