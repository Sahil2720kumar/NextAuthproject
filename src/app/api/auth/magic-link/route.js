import {connectToDB} from "@/utils/database"
import {nextRequest,nextResponse} from "next/server"
import vine,{errors} from "@vinejs/vine"
import {magicLinkSchema} from "@/validators/authSchema"
import ErrorReporter from "@/validators/errorReporter"
import {User} from "@/models/user"
import cryptoRandomString from 'crypto-random-string';
import Cryptr  from 'cryptr'
import { render } from '@react-email/render';
import MagicLinkEmail from "@/email/MagicLinkEmail"
import {transporter} from "@/utils/mail"
import bcrypt from "bcryptjs"


export async function POST(request){
  try {
    await connectToDB()
    const body = await request.json()
    const validator=vine.compile(magicLinkSchema)
    validator.errorReporter = () => new ErrorReporter()
    const output=await validator.validate(body)
    console.log(output)

    const user=await User.findOne({email:output.email})
    console.log(user)
    if (user) {
      //*generate random string 
      const randomString=cryptoRandomString({length: 64, type: 'alphanumeric'});
      user.magic_link_token=randomString
      user.magic_link_send_at=new Date()
      await user.save()
      
       //* Encrypt user email
      const crypt=new Cryptr(process.env.SECRET_KEY)
      const encryptEmail=crypt.encrypt(user.email)
      
      const url=`${process.env.BASE_URL}/magic-link/${encryptEmail}?signature=${randomString}`
      try {
        const emailHtml=render(MagicLinkEmail({
          params:{
            name:user.name,
            url:url
          }
        }))
        
        const options = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: 'Magic Link Login',
          html: emailHtml,
        };
        //* send mail to the user
        await transporter.sendMail(options);
        
        console.log(url)
        return nextResponse.json({
          message:"Email send sucessfully. please check your inbox",
          status:200
        },{
          status:200
        })
      } catch (error) {
        console.log("this is a email error:"+error)
        return nextResponse.json({
          message:"Something went to wrong...please try again later",
          status:405
        },{
          status:200
        })
      }
    }else{
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
         //console.log(error.messages)
         //return nextResponse.json(error.messages,{status:400})
         return nextResponse.json({
            status:400,
            errors:error.messages
          },{status:400})
        }
    
  }
}