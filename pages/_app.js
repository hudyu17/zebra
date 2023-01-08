import '../styles/globals.css'
// import { UserAuthContextProvider } from '../src/auth/useAuth'

// export default function App({ Component, pageProps }) {
//   return(
//     <UserAuthContextProvider>
//       <Component {...pageProps} />
//     </UserAuthContextProvider>
//   ) 
// }

import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}