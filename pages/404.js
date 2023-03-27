import Link from "next/link"
import Head from "next/head"

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Error - crossywalk</title>
        <meta name="description" content="Error 404 - crossywalk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/crosswalk.svg" />
      </Head>
      <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <Link href="//-79.4005188,43.6622882,12" className="inline-flex">
              <span className="sr-only">Your Company</span>
              <img
                className="h-12 w-auto"
                src="/crosswalk.svg"
                alt=""
              />
            </Link>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-base font-semibold text-yellow-700">404</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found :(</h1>
              <p className="mt-6 text-base text-gray-500">Sorry, we couldn’t find that page.</p>
              <div className="mt-6">
                <Link href="/-79.4005188,43.6622882,12" className="text-base font-medium text-yellow-700 hover:text-yellow-900">
                  Return to home
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
