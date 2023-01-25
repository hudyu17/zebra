import Layout from "../src/components/layout"
import Head from "next/head"

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
                <h1 className="text-2xl">So what&apos;s this all about?</h1>
                <div className="pt-6 flex max-w-prose flex-col gap-4">
                <p>
                    During my 5+ years of undergrad in Toronto, I saw the City install 2 new 
                    crosswalks in the riskiest spots surrounding Queen's Park. 
                </p>
                <p>
                    This was great, since crossing at these spots meant 
                    taking perhaps the dumbest high-risk low-reward gamble ever 
                    - a gamble I took many times 🤡</p>
                <p>
                    Everyone thought that these intersections were a death trap, but there was
                    no way to really prove it, outside of <span className="italic">actual deaths.</span>
                </p>
                <p>
                    That&apos;s what crossywalk is: a place for everyone to suggest and upvote 
                    crosswalks they think should exist.
                </p>
                <p className="pt-6">
                    Probably won't do much, but what&apos;s the harm in trying? 🤓
                </p>
                </div>
            </div>
        }/>
        </>
  )
}
