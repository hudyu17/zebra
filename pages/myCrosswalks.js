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
                <p>my crosswalks</p>
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {crosswalkData.map((crosswalk) => (
                <li key={crosswalk.id} className="col-span-1  rounded-lg bg-white shadow">
                <div className="flex w-full justify-between flex-col space-x-6 p-6 divide-y divide-gray-200">
                  <div className="">
                    <div className="flex items-center space-x-3">
                      <h3 className=" text-sm font-medium text-gray-900">{crosswalk.address}</h3>
                      
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{crosswalk.description}</p>
                  </div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <a
                        href={''}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="ml-3">Email</span>
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a
                        href={''}
                        className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="ml-3">Call</span>
                      </a>
                    </div>
                </div>
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
  
    return {
      props: {
        session,
        crosswalkData: JSON.parse(JSON.stringify(data))
      },
    }
  }