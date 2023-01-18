import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import Layout from "../src/components/layout"
import { StaticMap } from 'react-map-gl';
import { prisma } from "../src/prisma";
import { useMemo } from "react";
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'


export default function MyCrosswalks({ crosswalkData }) {
    console.log(crosswalkData)

    return (
        <Layout main={
            <div className="p-6 bg-slate-100 h-full">
                <h1 className="text-lg">My Crosswalks</h1>
                <ul role="list" className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 auto-rows-max">
                {crosswalkData.map((crosswalk) => (
                <li key={crosswalk.id} className="col-span-1  rounded-lg bg-white shadow">
                <div className="p-4 flex flex-col gap-4 h-full">
                  <h1>{crosswalk.address}</h1>
                  <p className="text-sm">{crosswalk.description}</p>
                  <p className="mt-auto">{crosswalk.votes} likes</p>
                </div>
                
                </li>
                ))}
                </ul>
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

    // const offlineData = [
    //   {
    //     id: 1,
    //     userId: 'hengjeung.yuen@gmail.com',
    //     latitude: 43.66601359148913,
    //     longitude: -79.4612869274421,
    //     address: 'Avenue and Cumberland',
    //     description: 'I want breakfast',
    //     votes: 4,
    //     shareInfo: 'nameImage',
    //     createdAt: '2023-01-16T22:13:23.810Z',
    //     updatedAt: '2023-01-16T22:13:23.810Z'
    //   },
    //   {
    //     id: 2,
    //     userId: 'hengjeung.yuen@gmail.com',
    //     latitude: 43.67081764090068,
    //     longitude: -79.38419891605797,
    //     address: 'Opposite the MC office',
    //     description: "I'm too lazy to take the correct exit out of bloor yonge so i risk my life outside the starbux",
    //     votes: 0,
    //     shareInfo: 'nameOnly',
    //     createdAt: '2023-01-17T23:36:45.345Z',
    //     updatedAt: '2023-01-17T23:36:45.345Z'
    //   }
    // ]
  
    return {
      props: {
        session,
        crosswalkData: JSON.parse(JSON.stringify(data)),
        // crosswalkData: offlineData
      },
    }
  }