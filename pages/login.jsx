import { useSession, signIn, signOut } from "next-auth/react";

const Login = () => {
    const {data: session} = useSession()

    if (session) {
        return (
            <div>
                <h1>logged in, {session.user.email}</h1>
                <button onClick={() => signOut()}>sign out here</button>
            </div>
        )
    } else {
        return (
            <div>
                <h1>you need to log in</h1>
                <button onClick={() => signIn(undefined, {callbackUrl: '/'})}>sign in here</button>
            </div>
        )
    }
}

export default Login;