import Layout from "../src/components/layout"
import Head from "next/head"
import Link from "next/link"


export default function About() {
  return (
    <>
        <Head>
            <title>About - crossywalk</title>
            <meta name="description" content="Suggest your own crosswalk" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/crosswalk.svg" />
            </Head>
        <Layout 
        main={        
            <div className="pt-20 lg:pt-6 px-6 bg-slate-100 h-full">
                {/* <h1 className="text-2xl">So what&apos;s this all about?</h1> */}
                
                <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">So, what&apos;s this all about?</h1>
                
                <div className="pt-6 flex max-w-prose flex-col gap-4">
                    <p className="text-lg">
                        Crossywalk is a place for you to suggest and vote on 
                        crosswalks that <span className="font-bold">you think should exist.</span>
                    </p>
                    <p>
                        Every city/suburb/town has those spots. The places where people need to cross a street, 
                        know that it's dangerous, but do it anyway - because the nearest crosswalk is 5 minutes away (if you're lucky).
                    </p>
                    <p>
                        My hope is that aggregating these suggestions will make it obvious which places
                        <span className="italic"> need </span>new crosswalks - and hopefully make them a reality.
                    </p>
                    
                    <Link
                        href="/-79.4005188,43.6622882,11"
                        className="inline-flex lg:w-44 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                        <p className="text-align-center">Get started</p>
                    </Link>
                    <p className="text-gray-500 mt-6 italic text-sm">
                        Made by <a className="text-indigo-700 hover:text-indigo-900" href="https://hudsonyuen.com" target="_blank" rel="noreferrer">Hudson</a>
                    </p>
                </div>
            </div>
        }/>
        </>
  )
}
