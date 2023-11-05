import Image from 'next/image'
import { getServerSession } from "next-auth"
import { authOptions } from './api/auth/[...nextauth]/options'
import {redirect} from 'next/navigation'
import SignOutButton from "@/components/SignOutButton"

export default async function Home() {
  const session=await getServerSession(authOptions)
  if(!session){
    redirect("/signin")
  }
  return (
    <>
      <h1 className="text-2xl">hello</h1>
       <p>{JSON.stringify(session)}</p>
       <SignOutButton/>
    </>
  )
}
