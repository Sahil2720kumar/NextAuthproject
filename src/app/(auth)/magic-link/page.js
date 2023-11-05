"use client"
import Link from "next/link"
import {useState} from "react"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import {useRouter} from "next/navigation"
import {signIn} from "next-auth/react"


export default function MagicLink() {
  const [authData,setAuthData]=useState({
    email:"",
  })
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState({})
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    console.log(authData)
    try {
      setLoading(true)
      const response=await axios.post("/api/auth/magic-link",{email:authData.email})
      console.log("response")
      console.log(response)
      if (response.data.status===405) {
        //something error SMTP ERROR...
        setLoading(false)
        toast.error(response.data.message,{
          position:"top-center"
        })
      }else if(response.data.status===200){
        //forgot Password email send
        setLoading(false)
        toast.success(response.data.message,{
          position:"top-center"
        })
      }
     } catch (error) {
      //console.log("this is a error message")
       setLoading(false)
       console.log(error)
       const errorData=error.response.data.errors
       setErrors(errorData)
       console.log(errors)
     }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 lg:justify-center">
     <div className="w-10/12 h-1/3 shadow shadow-md rounded border p-3">
        <h2 className="font-bold text-xl">Magic Link</h2>
        <p>Don't worry, just enter your email below and we will send verfication link to your email address then after verfication we redirect to your profile page.</p><br/>
      
        <form>
          
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold ">Email address</label>
              <input
                type="email"
                id="email"
                autoFocus
                onChange={(e)=>setAuthData({...authData,email:e.target.value})}
                className="p-1 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-1 focus:ring-red-200"
              />
              <span className="text-red-600 font-bold">{errors?.email}</span>
            </div>
          
           <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading?true:false}
                className={`my-4 w-full p-2 text-sm font-semibold text-white transition-colors duration-300  rounded-md shadow  focus:outline-none focus:ring-red-200 focus:ring-1 bg-red-500 ${loading?"bg-lime-500 hover:bg-lime-600":"bg-blue-500 hover:bg-blue-600"}`}
              >
                {loading?"processing...":"Magic Link"}
            </button>
        </form>
     </div>
    </div>
  )
}