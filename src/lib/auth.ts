import { PrismaAdapter } from "@auth/prisma-adapter"
import { getServerSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/utils/connect"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  session: {
    strategy: "jwt",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.userType = token.userType as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType || 'user'
        token.isAdmin = user.isAdmin || false
      } else if (token.id) {
        // Fetch user from DB on subsequent calls
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        })
        if (dbUser) {
          token.userType = dbUser.userType
          token.isAdmin = dbUser.isAdmin
        }
      }
      return token
    }
  }
}

export const getSession = () => getServerSession(authOptions)