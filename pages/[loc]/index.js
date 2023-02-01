import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { prisma } from "../../src/prisma"

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from "../../src/components/layout"
import Places from "../../src/components/crosswalkForm"
import { authOptions } from "../api/auth/[...nextauth]"
import { useRouter } from 'next/router'

export default function Home({ markers, locArray }) {
    const { data: session, status } = useSession()
    
    // offline dev
    // const session = {
    //   expires: "1",
    //   user: { email: "a", name: "Delta", image: "c" },
    // }

    // const locArray = loc.split(",")
  
    return (
    <>
      <Head>
        <title>crossywalk</title>
        <meta name="description" content="Suggest your own crosswalk" />
        <meta property="og:title" content="Crossywalk"/>
        <meta property="og:description" content="Suggest your own crosswalk"/>
        <meta property="og:image" content="/preview.png" />
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
  
  // checking valid location in query
  const loc = context.query.loc;
  const locArray = loc.split(",")
  if (locArray.length !== 3 || isNaN(locArray[0]) || isNaN(locArray[1]) || isNaN(locArray[2])) {
    return { notFound: true }
  }

  // for offline dev
  // const markers = []

  const markers = await prisma.crosswalk.findMany();

  return {
    props: {
      session,
      markers: JSON.parse(JSON.stringify(markers)),
      locArray: JSON.parse(JSON.stringify(locArray)),
    },
  }
}