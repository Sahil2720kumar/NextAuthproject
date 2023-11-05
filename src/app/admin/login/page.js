"use client"
import Link from "next/link"
import {useState} from "react"
import {useSearchParams} from "next/navigation"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import {useRouter} from "next/navigation"
import {signIn} from "next-auth/react"

export default function adminSignIn(){
  const params=useSearchParams()
  const [authData,setAuthData]=useState({
    email:"",
    password:"",
  })
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState({})
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    console.log(authData)
     setLoading(true)
    try {
      axios.defaults.baseURL="http://localhost:3000"
      const res=await axios.post("api/auth/admin/login",authData)
      const response=res.data
      console.log(response)
      setLoading(false)
      toast.success(response.message,{
        position:"top-center"
      })
      if(response.status===200){
        await signIn("credentials",{
          email:authData.email,
          password:authData.password,
          callbackUrl:"/admin/dashboard",
          redirect:true
        })
      }
      //router.push("/dashboard")
    } catch (error) {
      console.log(error)
      const errorData=error.response.data.errors
      setErrors(errorData)
      console.log(errors)
      setLoading(false)
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 lg:justify-center">
     <div className="w-10/12 h-1/3 shadow shadow-md rounded border p-3">
        <h2 className="font-bold text-xl">Admin Login</h2>
        <p>welcome back admin...</p><br/>
        
         {params.get("message")?<p className="bg-lime-500 p-2 text-white rounded font-bold">{params.get("message")}</p>:<p></p>}
          
        <form>
          <div className="block">
            <label htmlFor="email" className="text-sm font-semibold">Email address</label>
            <input
                type="email"
                id="email"
                autoFocus
                onChange={(e)=>setAuthData({...authData,email:e.target.value})}
                className="p-[2px] w-full transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-1 focus:ring-red-200"
              />
             <span className="text-sm text-red-600 font-bold">{errors?.email}</span>
          </div>
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
           <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading?true:false}
                className={`my-4 w-full p-2 text-sm font-semibold text-white transition-colors duration-300  rounded-md shadow  focus:outline-none focus:ring-red-200 focus:ring-1 bg-red-500 ${loading?"bg-lime-500 hover:bg-lime-600":"bg-blue-500 hover:bg-blue-600"}`}
              >
                {loading?"processing...":"Log in"}
            </button>
        </form>
     </div>
    </div>
  )
}