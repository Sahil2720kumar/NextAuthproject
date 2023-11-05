"use client";
import {signOut} from "next-auth/react"


export default function SignOutButton(){
  return (
    <button className="bg-blue-500 p-2 rounded my-2"
      onClick={()=>signOut({callbackUrl:"/signin",redirect:true})}
    >
      Sign Out
    </button>
  )
}