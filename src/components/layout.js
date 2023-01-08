import React from 'react'
import Link from 'next/link'

export default function Layout({ main }) {
    const authenticated = false;

    const logout = () => null;


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
                    <button onClick={logout}>
                        logout
                    </button>
                    </>
                    :
                    <Link href="/auth">
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
