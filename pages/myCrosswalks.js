import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import Layout from "../src/components/layout"
import { StaticMap } from 'react-map-gl';
import { prisma } from "../src/prisma";
import { useMemo } from "react";

export default function MyCrosswalks({ crosswalkData }) {
    console.log(crosswalkData)

    const myCrosswalks = useMemo(
        () =>
          crosswalkData.map((crosswalk) => (
            // <StaticMap
            //     key={`crosswalk-${crosswalk.id}`}
            //     width={400}
            //     height={400}
            //     latitude={crosswalk.latitude}
            //     longitude={crosswalk.longitude}
            //     zoom={14} 
            //     mapStyle="mapbox://styles/mapbox/streets-v9"
            //     mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
            // />
            <p>{crosswalk.latitude}</p>
          )),
        []
      );

    return (
        <Layout main={
            <div>
                <p>my crosswalks</p>
                {myCrosswalks}
            </div>
        }/>
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
    
    const data = await prisma.crosswalk.findMany({
        where: {
            userId: session.user.email
        }
    })
  
    return {
      props: {
        session,
        crosswalkData: JSON.parse(JSON.stringify(data))
      },
    }
  }