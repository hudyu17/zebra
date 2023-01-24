import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { prisma } from "../../src/prisma"

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from "../../src/components/layout"
import Places from "../../src/components/crosswalkForm"
import { authOptions } from "../api/auth/[...nextauth]"


export default function Home({ markers, loc }) {
    const { data: session, status } = useSession()
    
    // offline dev
    // const session = {
    //   expires: "1",
    //   user: { email: "a", name: "Delta", image: "c" },
    // }

    const locArray = loc.split(",")
  
    return (
    <>
      <Head>
        <title>crossywalk</title>
        <meta name="description" content="Suggest your own crosswalk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/crosswalk.svg" />
      </Head>
      <Layout 
      main={        
        <div>
          <Places markers={markers} session={session} locArray={locArray}/>
        </div>
      }/>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const markers = await prisma.crosswalk.findMany();

  const loc = context.query.loc;

  // for offline dev
  // const markers = []
  
  return {
    props: {
      session,
      markers: JSON.parse(JSON.stringify(markers)),
      loc: JSON.parse(JSON.stringify(loc)),
    },
  }
}