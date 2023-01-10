import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import CrosswalkForm from "../../src/components/crosswalkForm"
import Places from "../../src/components/crosswalkForm"

export default function Add() {
  return (
    <div>
        {/* <CrosswalkForm/> */}
        <Places/>
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