import {connectToDB} from "@/utils/database"
import {nextRequest,nextResponse} from "next/server"
import vine,{errors} from "@vinejs/vine"
import {adminRegisterSchema} from "@/validators/authSchema"
import ErrorReporter from "@/validators/errorReporter"
import {User} from "@/models/user"
import bcrypt from "bcryptjs"

export async function POST(request){
  try {
    await connectToDB()
    //name,email,password,confirm_password,role
    const body = await request.json()
    const validator=vine.compile(adminRegisterSchema)
    validator.errorReporter = () => new ErrorReporter()
    const output=await validator.validate(body)
    console.log(output)
    const regUser=await User.findOne({email:output.email})
    if (regUser) {
      return nextResponse.json({
        status:400,
        errors:{
          email:"Email already exists"
        }
      },{status:400})
    } else {
      output.password=bcrypt.hashSync(
        output.password,
        parseInt(process.env.BCRYPT_SALT)
      )
      await User.create(output)
      return nextResponse.json({status:200,message:"Admin Account created successfuly! please login your account"},{status:200})
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