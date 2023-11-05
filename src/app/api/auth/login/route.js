import {connectToDB} from "@/utils/database"
import {nextRequest,nextResponse} from "next/server"
import vine,{errors} from "@vinejs/vine"
import {loginSchema} from "@/validators/authSchema"
import ErrorReporter from "@/validators/errorReporter"
import {User} from "@/models/user"
import bcrypt from "bcryptjs"

export async function POST(request){
  try {
    await connectToDB()
    const body = await request.json()
    const validator=vine.compile(loginSchema)
    validator.errorReporter = () => new ErrorReporter()
    const output=await validator.validate(body)
    
    //check if user is exists
    const logUser=await User.findOne({email:output.email})
    if (logUser) {
      try {
        //check password
        const checkPassword=bcrypt.compareSync(output.password,logUser.password)
        if (checkPassword) {
          return nextResponse.json({
            status:200,
            message:"User logged in "
          },{
            status:200
          })
        }else{
          return nextResponse.json({
            status:400,
            errors:{
              password:"Password not matched !"
            }
          },{
            status:400
          })
        }
      } catch (error) {
        return nextResponse.json({
          status:400,
          errors:{
            email:"Please login your user social account."
          }
        },{
          status:400
        })
      }
      
    } else {
      return nextResponse.json({
          status:400,
          errors:{
            email:"User not found with this email !"
          }
        },{
          status:400
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