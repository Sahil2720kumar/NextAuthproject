"use client"
import Link from "next/link"
import {useState,useEffect} from "react"
//import {useSearchParams} from "next/navigation"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import {useRouter} from "next/navigation"
import {signIn} from "next-auth/react"

export default function VerifyMagicLink({params,searchParams}){
 // console.log(params,searchParams)
  
  useEffect(() => {
    async function main(){
      try {
        const response=await axios.post("/api/auth/magic-link/verify",{
          email:params.email,
          signature:searchParams.signature
        })
        if (response.data.status===400) {
          // url is not correct
          toast.error(response.data.message,{
            position:"top-center"
          })
        }else if(response.data.status===200){
        //login succuessfully || verfied magic link
          toast.success(response.data.message,{
            position:"top-center"
          })
          await signIn("credentials",{
            email:response.data.email,
            password:"",
            callbackUrl:"/",
            redirect:true
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    main()
  }, []);
  
  return(
    <div className="h-screen flex items-center justify-center" >
      <h2>we verify your magic link wait for a seconds...</h2>
    </div>
  )
}