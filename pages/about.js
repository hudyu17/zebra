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
            <div className="p-6 bg-slate-100 h-full">
                <h1 className="text-2xl">So what's this all about?</h1>
                <div className="pt-6 flex max-w-prose flex-col gap-4">
                <p>
                    During my 5+ years of undergrad in Toronto, I saw the City install 2 new 
                    crosswalks in the riskiest spots surrounding Queen's Park. 
                </p>
                <p>
                    This was great, especially considering how crossing at these spots meant 
                    taking perhaps the dumbest high-risk low-reward gamble a person 
                    could ever take - a gamble I took many times 🤡</p>
                <p>
                    But that got me thinking - how did it take the better part of 5 years for these
                    crosswalks to get installed?
                </p>
                <p>
                    Everyone I knew thought that these intersections were a death trap, so surely 
                    the City understood as well.
                </p>
                <p>
                    Maybe they did, or maybe they didn't. Either way, that's why crossywalk exists: so you
                    can finally suggest and upvote crosswalks you think should exist. 
                </p>
                </div>
            </div>
        }/>
        </>
  )
}
