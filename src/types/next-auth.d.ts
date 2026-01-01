import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "PATIENT" | "PHARMACY_OWNER" | "PHARMACY_STAFF" | "SUPER_ADMIN"
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: "PATIENT" | "PHARMACY_OWNER" | "PHARMACY_STAFF" | "SUPER_ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: "PATIENT" | "PHARMACY_OWNER" | "PHARMACY_STAFF" | "SUPER_ADMIN"
  }
}
