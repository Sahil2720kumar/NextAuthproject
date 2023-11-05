import {connectToDB} from "@/utils/database"
import {nextRequest,nextResponse} from "next/server"
import {User} from "@/models/user"
import cryptoRandomString from 'crypto-random-string';
import Cryptr  from 'cryptr'
import { render } from '@react-email/render';
import bcrypt from "bcryptjs"

export async function POST(request){
  try {
    await connectToDB()
    console.log("post")
    const output = await request.json()
    console.log(output)

    //* decrypt user email
    const crypt=new Cryptr(process.env.SECRET_KEY)
    const decryptEmail=crypt.decrypt(output.email)
    console.log("decrypt email :"+decryptEmail)
    
    const user=await User.findOne({email:decryptEmail,magic_link_token:output.signature})
    console.log(user)
    if (user) {
      const fifteenMinAgo=new Date()
      fifteenMinAgo.setMinutes(fifteenMinAgo.getMinutes()-15)
      if(user.magic_link_send_at <= fifteenMinAgo){
        user.magic_link_token=null
        user.magic_link_send_at=null
        await user.save()
        return nextResponse.json({
          status:400,
          message:"Magic link is expired !"
        })
      }
      user.magic_link_token=null
      user.magic_link_send_at=null
      await user.save()
      return nextResponse.json({
          status:200,
          message:"Magic link is verfied..!",
          email:decryptEmail
      })
    }else{
      return nextResponse.json({
        status:400,
        message:"Magic link not valid !"
      })
    }
    
  } catch (error) {
    return nextResponse.json({
        status:400,
        message:"Something went to wrong.. !"
    },{
      status:400
    })
  }
}