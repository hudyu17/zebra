import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

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
                        className="" 
                        href="/-79.4005188,43.6622882,11"
                    >
                        <div className="flex flex-shrink-0 items-center px-4">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                alt="Your Company"
                            />
                        </div>
                    </Link>
                    
                    <nav className="mt-5 flex-1 space-y-1 bg-gray-800 px-2 shadow-xl" aria-label="Sidebar">
                        {authenticated ?
                        <div className='flex flex-col h-full justify-between'>
                            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                href='/myCrosswalks'
                            >
                                My Crosswalks
                            </Link>
                            <div className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" onClick={() => signOut()}>
                                <ArrowLeftOnRectangleIcon className='h-6 w-6 mr-2'/>
                                <p>Logout</p>
                            </div>
                        </div>
                        :
                        <Link 
                        className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            href="/login"
                        >
                            login/signup
                        </Link>}
                    </nav>
                </div>

                {authenticated &&
                <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    <a href="#" className="group block w-full flex-shrink-0">
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
                        <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
                        </div>
                    </div>
                    </a>
                </div>
                }
            </div>

            <main className='md:w-5/6'>
                {main}
            </main>
        
        </div>
    )
}
