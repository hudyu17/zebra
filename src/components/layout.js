import React from 'react'
import Link from 'next/link'
import { useUserAuth } from '../auth/useAuth';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ main }) {
    const {data: session} = useSession()

    // const authenticated = false;
    const authenticated = !! session

    // const logout = () => null;


    // const { logout, user } = useUserAuth();
    // const authenticated = !! user;

    return (
        <div className="bg-gray-800 max-w-screen-2xl mx-auto h-screen w-screen text-white grid grid-cols-5">
            <main className='col-span-4'>
                {main}
            </main>
            <nav className="bg-gray-900">
               <div className="flex flex-col gap-10 p-6">
                    {/* <Link href="/">
                        home
                    </Link> */}
                    
                    {authenticated ?
                        <div className="cursor-pointer" onClick={() => signOut()}>
                            logout
                        </div>
                    :
                    <Link href="/login">
                        login/signup
                    </Link>}
                    
               </div>
            </nav>

        
        </div>
    )
}
