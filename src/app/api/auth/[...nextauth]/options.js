import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {User} from "@/models/user"
import {connectToDB} from "@/utils/database"

export const authOptions={
  pages:{
    signIn:"/signin",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await connectToDB()
        const findUser=await User.findOne({email:user.email})
        if (findUser) {
          return true;
        }
        await User.create({name:user.name,email:user.email,avatar:user.image,role:"User"});
        return true
      } catch (error) {
        console.log("sign error ",error)
      }
    },
    async jwt({token,user}){
      if(user){
        user.role=user?.role===null?"User":user?.role;
        token.user=user
      }
      return token;
    },
    async session({session,token,user}){
      session.user=token.user
      return session;
    },
  },
  providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  CredentialsProvider({
    name: 'Next auth',    
    credentials: {
      email: { label: "Email", type: "email", placeholder: "Enter your email" },
      password: { label: "Password",type:"password", placeholder: "Enter your password" }
    },
    async authorize(credentials, req) {
      await connectToDB()
      const user=await User.findOne({email:credentials?.email}).select("-password")
      if (user) {
        return user;
      }else{
        return null;
      }
    }
  })
 ]
}