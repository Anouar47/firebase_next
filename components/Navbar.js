import Link from "next/link"
import { useContext } from "react";
import { UserContext } from "@/lib/context";

export default function Navbar() {

    const {user,username} = useContext(UserContext);
    
  return (
    <nav className="navbar">
        <ul>
            <li className="push-left">
                <Link href="/">
                    <button className="btn-logo">FEED</button>
                </Link>
            </li>
            {username && (
                <>
                <li className="push-left">
                <Link href="/admin">
                    <button className="btn-blue">Write Post</button>
                </Link>
            </li>
            <li>
                <Link href={`/${username}`}>
                    <img src={user?.photoURL } />
                </Link>
            </li>
                </>

            )}

            {!username && (
                <li>
                <Link href="/enter">
                    <button className="btn-blue">Log In</button>
                </Link>
            </li>

            )}

        </ul>

    </nav>
  )
}
