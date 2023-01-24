import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react';
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Layout({ main }) {
    const {data: session} = useSession()

    // offline dev
    // const session = {
    //     expires: "1",
    //     user: { email: "a", name: "Delta", image: "c" },
    //   }

    const authenticated = !! session

    return (
        <div className='md:flex w-screen h-screen grid grid-rows-7'>
            <div className="flex min-h-0 flex-1 flex-col bg-gray-800 md:w-1/6 grid-start-7">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <Link 
                        className="mx-5 flex gap-3" 
                        href="/-79.4005188,43.6622882,11"
                    >              
                        <img src="/crosswalk.svg" className='h-10 w-10 my-auto'/>
                        <h1 className='text-yellow-500 lg:text-2xl font-fredoka-one my-auto'>crossywalk</h1>
                    </Link>
                    
                    <nav className="mt-5 flex-1 space-y-1 px-2" aria-label="Sidebar">
                        {authenticated ?
                        <div className='flex flex-col h-full justify-between'>
                            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href='/myCrosswalks'
                            >
                                My Crosswalks
                            </Link>
                            
                            <div className='flex flex-col gap-2'>
                            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href='/about'
                            >
                                <InformationCircleIcon className='h-6 w-6 mr-2'/>
                                <p>About</p>
                            </Link>
                            <div className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" 
                                onClick={() => signOut()}>
                                <ArrowLeftOnRectangleIcon className='h-6 w-6 mr-2'/>
                                <p>Logout</p>
                            </div>
                            </div>

                        </div>
                        :
                        <div className='flex flex-col gap-2'>
                            <Link 
                            className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href="/login"
                            >
                                <div className='flex'>
                                <ArrowRightOnRectangleIcon className='h-6 w-6 mr-2'/>
                                <p className='my-auto'>Login or Signup</p>
                                </div>
                                
                            </Link>
                            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            href='/about'
                        >
                            <InformationCircleIcon className='h-6 w-6 mr-2'/>
                            <p>About</p>
                        </Link>
                        </div>
                        }
                    </nav>
                </div>

                {authenticated &&
                <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    <div className="flex items-center">
                        <div>
                        <img
                            className="inline-block h-9 w-9 rounded-full"
                            src={session.user.image}
                            alt=""
                        />
                        </div>
                        <div className="ml-3">
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        </div>
                    </div>
                </div>
                }
            </div>

            <main className='md:w-5/6'>
                {main}
            </main>
        
        </div>
    )
}
