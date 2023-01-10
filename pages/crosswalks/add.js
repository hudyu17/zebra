import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import CrosswalkForm from "../../src/components/crosswalkForm"
import Places from "../../src/components/crosswalkForm"

export default function Add() {
    const { data: session, status } = useSession()

  return (
    <div>
        {/* <CrosswalkForm/> */}
        <Places/>
        <div>{session.user.email}</div>
    </div>
  )
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions)
  
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }
  
    return {
      props: {
        session,
      },
    }
  }