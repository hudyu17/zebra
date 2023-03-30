import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { prisma } from "../../src/prisma"
import { useState } from "react"

import Head from 'next/head'
import Image from 'next/image'
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import Layout from "../../src/components/layout"
import Places from "../../src/components/crosswalkForm"
import { authOptions } from "../api/auth/[...nextauth]"

export default function Home({ markers, locArray }) {
    const { data: session, status } = useSession()
    
    const [loaded, setLoaded] = useState(false);
    
    // // OFFLINE DEV
    // const session = {
    //   expires: "1",
    //   user: { email: "a", name: "Delta", image: "c" },
    // }

    // const locArray = loc.split(",")

    return (
    <>
      <Head>
        <title>crossywalk - Suggest your own crosswalk</title>
        <meta name="description" content="Suggest your own crosswalk" />
        <meta property="og:title" content="Crossywalk"/>
        <meta property="og:description" content="Suggest your own crosswalk"/>
        <meta property="og:image" content="/preview.png" />
      </Head>
      
      {!loaded && <div className="flex h-screen">
        <div className="m-auto">
        <ArrowPathIcon className="h-10 w-10 mx-auto animate-spin text-gray-500"/>
        </div>
      </div>}

      <Layout 
      main={        
        <div>
          <Places markers={markers} session={session} locArray={locArray} setLoaded={setLoaded}/>
        </div>
      }/>
      
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  
  // Quick check that query contains valid location
  const loc = context.query.loc;
  const locArray = loc.split(",")
  if (locArray.length !== 3 || isNaN(locArray[0]) || isNaN(locArray[1]) || isNaN(locArray[2])) {
    return { notFound: true }
  }

  // // OFFLINE DEV
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