import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const {pathname} = request.nextUrl
  if (pathname=="/signin" || pathname=="/admin/login") {
    console.log("login page")
    return NextResponse.next()
  }
  const token=await getToken({req:request})
  
  //*protected routes for user
  const userProtectedRoutes=["/"];
   //*protected routes for admin
  const adminProtectedRoutes=["/admin/dashboard"];
  
  if (token===null && (userProtectedRoutes.includes(pathname) || adminProtectedRoutes.includes(pathname))) {
    return NextResponse.redirect(new URL('/signin?message=please login first to access private urls', request.url))  
  }
  
  //get user from token
  const user=token?.user
  //user try access admin routes
  if(adminProtectedRoutes.includes(pathname) && user?.role==="User"){
    return NextResponse.redirect(new URL('/admin/login?message=please login first to access private urls !'),request.url)
  }
  
  //admin try access user routes
  if(userProtectedRoutes.includes(pathname) && user?.role==="Admin"){
    return NextResponse.redirect(new URL('/signin?message=please login first to access private urls', request.url))
  }
  
}
 
export const config = {
  matcher: '/',
}