"use client"
import Link from "next/link"
import {useState} from "react"
//import {useSearchParams} from "next/navigation"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import {useRouter} from "next/navigation"
import {signIn} from "next-auth/react"


export default function resetPassword({params,searchParams}) {
  const router=useRouter()
  console.log(params,searchParams)
  const [authData,setAuthData]=useState({
    password:"",
    password_confirmation:"",
  })
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState({})
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      const response=await axios.post("/api/auth/reset-password",{
        email:params?.email,
        signature:searchParams?.signature,
        ...authData
      })
      //console.log("this is a success message")
      console.log("response")
      console.log(response)
      if (response.data.status===400) {
        //reset url is not correct
        setLoading(false)
        toast.error(response.data.message,{
          position:"top-center"
        })
      }else if(response.data.status===200){
        //Password cheange successfully
        setLoading(false)
        toast.success(response.data.message,{
          position:"top-center"
        })
        router.push(`/signin?message=${response.data.message}`)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      const errorData=error.response?.data.errors
      setErrors(errorData)
      console.log(errors)
    }
  }
  
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 lg:justify-center">
     <div className="w-10/12 h-1/3 shadow shadow-md rounded border p-3">
        <h2 className="font-bold text-xl">Reset Password ?</h2>
        <p>Don't worry we reset your password, just enter your email below and we will send verfication link to your email address</p><br/>
        
        <form>
          
          <div className="block">
            <label htmlFor="password" className="block text-sm font-semibold">password</label>
            <input
                type="password"
                id="password"
                autoFocus
                onChange={(e)=>setAuthData({...authData,password:e.target.value})}
                className="p-[2px] w-full transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-1 focus:ring-red-200"
              />
             <span className="text-sm text-red-600 font-bold">{errors?.password}</span>
          </div>
          
           <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="confirm_password" className="text-sm font-semibold ">Confirm Password</label>
              </div>
              <input
                type="password"
                id="password_confirmation"
                onChange={(e)=>setAuthData({...authData,password_confirmation:e.target.value})}
                className="p-1 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
              
            </div>
          
           <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading?true:false}
                className={`my-4 w-full p-2 text-sm font-semibold text-white transition-colors duration-300  rounded-md shadow  focus:outline-none focus:ring-red-200 focus:ring-1 bg-red-500 ${loading?"bg-lime-500 hover:bg-lime-600":"bg-blue-500 hover:bg-blue-600"}`}
              >
                {loading?"processing...":"Reset password"}
            </button>
        </form>
     </div>
    </div>
  )
}