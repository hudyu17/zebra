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
        <div className="bg-gray-800 max-w-screen-2xl mx-auto h-screen w-screen text-white">
            <nav className="bg-gray-900">
               <div className="px-6 flex items-center justify-between h-16">
                    <Link href="/">
                        home
                    </Link>
                    
                    {authenticated ? <>
                        <Link href="/crosswalks/add">
                        add crosswalk
                    </Link>
                    <button onClick={() => signOut()}>
                        logout
                    </button>
                    </>
                    :
                    <Link href="/login">
                        login/signup
                    </Link>}
                    
               </div>
            </nav>
            <main>
                {main}
            </main>
        
        </div>
    )
}
