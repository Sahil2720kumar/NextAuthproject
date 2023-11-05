'use client'
import Link from "next/link"
import {useState} from "react"
import {useSearchParams} from "next/navigation"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import {useRouter} from "next/navigation"
import {signIn} from "next-auth/react"

export default function LogIn() {
  const router=useRouter()
  const params=useSearchParams()
  const [authData,setAuthData]=useState({
    email:"",
    password:"",
  })
  const [loading,setLoading]=useState(false)
  const [isGoogleLoading,setIsGoogleLoading]=useState(false)
  const [isGithubLoading,setIsGithubLoading]=useState(false)
  const [errors,setErrors]=useState({})
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    console.log(authData)
     setLoading(true)
    try {
      const res=await axios.post("api/auth/login",authData)
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
          callbackUrl:"/",
          redirect:true
        })
      }
      router.push("/")
    } catch (error) {
      const errorData=error.response.data.errors
      setErrors(errorData)
      console.log(errors)
      setLoading(false)
    }
  }
  
  const githubSignIn=async(e)=>{
    e.preventDefault()
    setIsGithubLoading(true)
    console.log("github login")
    await signIn("github",{
      callbackUrl:"/",
      redirect:true,
    })
    //setIsGithubLoading(false)
  }
  
  const googleSignIn=async(e)=>{
    e.preventDefault()
    setIsGoogleLoading(true)
    console.log("google login")
    await signIn("google",{
      callbackUrl:"/",
      redirect:true,
    })
    //setIsGithubLoading(false)
  }
  
  return (
      <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
      <div
        className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
      >
        <div
          className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
        >
          <div className="my-3 text-4xl font-bold tracking-wider text-center">
            <a href="#">NEXT AUTHENTICATION</a>
          </div>
          
          {params.get("message")?<p className="bg-lime-500 p-2 text-white rounded font-bold">{params.get("message")}</p>:<p></p>}
          
          <p className="flex flex-col items-center justify-center mt-10 text-center">
            <span>Don't have an account?</span>
            <Link href="/signup" className="underline">Get Started!</Link>
          </p>
          <p className="mt-6 text-sm text-center text-gray-300">
            Read our <a href="#" className="underline">terms</a> and <a href="#" className="underline">conditions</a>
          </p>
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
          <form action="#" className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
              <input
                type="email"
                id="email"
                autoFocus
                onChange={(e)=>setAuthData({...authData,email:e.target.value})}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
              <span className="text-red-600 font-bold">{errors?.email}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                <Link href={"/forgot-password"} className="text-sm text-blue-600 hover:underline focus:text-blue-800">Forgot Password?</Link>
              </div>
              <input
                type="password"
                id="password"
                onChange={(e)=>setAuthData({...authData,password:e.target.value})}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
              <span className="text-red-600 font-bold">{errors?.password}</span>
            </div>
            <div>
               <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading?true:false}
                className={`w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300  rounded-md shadow  focus:outline-none focus:ring-blue-200 focus:ring-4 ${loading?"bg-lime-500 hover:bg-lime-600":"bg-blue-500 hover:bg-blue-600"}`}
              >
                {loading?"processing...":"Log in"}
              </button>
            </div>
            <div className="flex flex-col space-y-5">
              <span className="flex items-center justify-center space-x-2">
                <span className="h-px bg-gray-400 w-14"></span>
                <span className="font-normal text-gray-500">or login with</span>
                <span className="h-px bg-gray-400 w-14"></span>
              </span>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={githubSignIn}
                  disabled={isGithubLoading?true:false}
                  className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 rounded-md group hover:bg-gray-800 focus:outline-none"
                >
                  <span>
                    <svg
                      className="w-5 h-5 text-gray-800 fill-current group-hover:text-white"
                      viewBox="0 0 16 16"
                      version="1.1"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-white">{isGithubLoading?"Github processing...":"Github"}</span>
                </button>
                <button
                  onClick={googleSignIn}
                  disabled={isGoogleLoading?true:false}
                 className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-red-500 text-white rounded-md group hover:bg-red-500 focus:outline-none"
                >
                  <span>
                  <svg className="w-5 h-5 text-gray-800 fill-current group-hover:text-white" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
                  </span>
                  <span className="text-sm font-medium text-black group-hover:text-white">{isGoogleLoading?"Google processing...":"Google"}</span>
                </button>
                <Link
                 href={"/magic-link"}
                 className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-red-500 text-white rounded-md group hover:bg-red-500 focus:outline-none"
                >                 
                  <span className="text-sm text-center font-medium text-black group-hover:text-white">Sign in with Magic Link</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
