import {getServerSession} from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import {redirect} from "next/navigation"

export default async function AdminDashboard(){
  const session=await getServerSession(authOptions)
  if (session===null || session?.user?.role!=="Admin") {
    return redirect("/admin/login?message=please login first")
  }
  return <h1>this is admin dashboard </h1>
}