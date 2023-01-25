import Link from 'next/link'
import { useState, Fragment } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, Bars3Icon, InformationCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Layout({ main }) {
    const {data: session} = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // offline dev
    // const session = {
    //     expires: "1",
    //     user: { email: "a", name: "Delta", image: "c" },
    //   }

    const authenticated = !! session

    return (
        <div className='flex flex-col lg:flex-row w-screen h-screen'>
            <div className="flex bg-gray-800 lg:flex-col justify-between py-2 lg:py-0 z-10">
                <div className="flex lg:flex-col lg:flex-1  lg:pt-5 lg:pb-4 w-full">
                    <Link 
                        className="mx-4 lg:mx-5 flex gap-3" 
                        href="/-79.4005188,43.6622882,11"
                    >              
                        <img src="/crosswalk.svg" className='h-7 w-7 lg:h-9 lg:w-9 my-auto'/>
                        <h1 className='text-yellow-500 lg:text-xl font-fredoka-one my-auto'>crossywalk</h1>
                    </Link>
                    
                    <nav className="lg:mt-5 flex-1 space-y-1 px-2 lg:ml-0 " aria-label="Sidebar">
                        {authenticated ?
                        <div className='h-full flex flex-col'>
                        {/* mobile view small */}
                        <div className='md:hidden flex my-auto self-end pr-2'>
                            {/* <Bars3Icon className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}/> */}
                        
                                {/* <div className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <div>
                                      <Link
                                        href="/myCrosswalks"
                                        className="text-gray-700 block px-4 py-2 text-sm"
                                      >
                                        My Crosswalks
                                      </Link>
                                  </div>
                                  <div>
                                      <Link
                                        href="/about"
                                        className="text-gray-700 block px-4 py-2 text-sm"
                                      >
                                        About
                                      </Link>
                                  </div>
                                  <div>
                                      <div
                                        className="text-gray-700 block px-4 py-2 text-sm"
                                        onClick={() => signOut()}
                                      >
                                        Logout
                                      </div>
                                  </div>
                                </div>
                              </div> */}
                            <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="flex h-6 w-6 text-gray-300 hover:text-white cursor-pointer">
                            <span className="sr-only">Open options</span>
                            <Bars3Icon aria-hidden="true" />
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
                          <Menu.Items className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                  className={classNames(
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm flex'
                                  )}
                                  href="/myCrosswalks"
                                >
                                  <p className="my-auto">My Crosswalks</p>
                                  <QueueListIcon className="h-6 w-6 pl-2"/>
                                </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                  className={classNames(
                                    active ? 'bg-indigo-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                  href="/about"
                                >
                                  About
                                </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={classNames(
                                      active ? 'bg-gray-500 text-white' : 'text-gray-500',
                                      'block w-full px-4 py-2 text-left text-sm'
                                    )}
                                    onClick={() => signOut()}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                            
                        </div>
                        {/* desktop view large */}
                        <div className='hidden md:flex flex lg:flex-col h-full justify-between'>
                            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href='/myCrosswalks'
                            >
                                <QueueListIcon className='hidden lg:block h-6 w-6 mr-2'/>
                                <p>My Crosswalks</p>
                            </Link>
                            
                            <div className='flex flex-row lg:flex-col gap-2'>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                    href='/about'
                                >
                                    <InformationCircleIcon className='hidden lg:block h-6 w-6 mr-2'/>
                                    <p>About</p>
                                </Link>
                                <div className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" 
                                    onClick={() => signOut()}>
                                    <ArrowLeftOnRectangleIcon className='hidden lg:block h-6 w-6 mr-2'/>
                                    <p>Logout</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        :
                        <div className='flex lg:flex-col gap-2 justify-between'>
                            <Link 
                                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href='/about'
                            >
                                <InformationCircleIcon className='hidden lg:block h-6 w-6 mr-2'/>
                                <p>About</p>
                            </Link>
                            <button 
                                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center mr-2 px-2 py-2 text-sm font-medium rounded-md"
                                onClick={() => signIn("google", {callbackUrl: '/'})}
                            >
                                {/* <div className='flex'> */}
                                <ArrowRightOnRectangleIcon className='hidden lg:block h-6 w-6 mr-2'/>
                                <p className=''>Login or Signup</p>
                                {/* </div> */}
                                
                            </button>
                        </div>
                        }
                    </nav>
                </div>

                {authenticated &&
                <div className="flex flex-shrink-0 lg:bg-gray-700 md:px-3 lg:p-4">
                    <div className="flex items-center">
                        <div>
                        <img
                            className="inline-block h-8 w-8 lg:h-9 lg:w-9 rounded-full"
                            src={session.user.image}
                            alt=""
                        />
                        </div>
                        <div className="ml-3">
                        <p className="hidden lg:flex text-sm font-medium text-white">{session.user.name}</p>
                        </div>
                    </div>
                </div>
                }
            </div>

            <main className='lg:relative fixed w-screen h-screen lg:flex-1'>
                {main}
            </main>
        
        </div>
    )
}
