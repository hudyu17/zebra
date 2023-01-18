import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import Layout from "../src/components/layout"
import { prisma } from "../src/prisma";
import { useMemo, Fragment, useState } from "react";
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import DeleteModal from "../src/components/deleteModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function MyCrosswalks({ crosswalkData }) {
    const [deleteOpen, setDeleteOpen] = useState(false)

    const handleDelete = () => {
      setDeleteOpen(true)
    }

    return (
        <Layout main={
            <div className="p-6 bg-slate-100 h-full">
                <h1 className="text-lg">My Crosswalks</h1>
                <ul role="list" className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 auto-rows-max">
                {crosswalkData.map((crosswalk) => (
                <li key={crosswalk.id} className="col-span-1  rounded-lg bg-white shadow">
                <div className="p-4 flex flex-col gap-4 h-full">
                  <div className="flex justify-between">
                    <h1>{crosswalk.address}</h1>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          <span className="sr-only">Open options</span>
                          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                  )}
                                >
                                  Edit
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? 'bg-red-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                  onClick={handleDelete}
                                >
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <p className="text-sm">{crosswalk.description}</p>
                  <p className="mt-auto">{crosswalk.votes} likes</p>
                </div>
                
                </li>
                ))}
                </ul>
                <DeleteModal open={deleteOpen} setOpen={setDeleteOpen}/>
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