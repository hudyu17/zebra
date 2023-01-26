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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
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