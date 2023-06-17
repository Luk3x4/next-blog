import Link from "next/link";
import React, { useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react'

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: session } = useSession()
    return (
        <>
            <nav className="h-12 bg-white px-8 fixed top-0 w-screen shadow-sm flex justify-between items-center">
                <Link className="text-2xl hover:text-gray-700 duration-300" href='/'>NextBlog</Link>
                <div className={`space-x-2 flex links ${isOpen && 'active'}`}>
                    <Link className="text-xl hover:text-gray-700 duration-300" href="/create">Create</Link>
                    {!session && <a 
                      className="text-xl hover:text-gray-700 duration-300 cursor-pointer"
                      onClick={() => signIn("discord")}
                    >
                        Sign In
                    </a>}
                    {session && (
                      <a 
                        className="text-xl hover:text-gray-700 duration-300 cursor-pointer"
                        onClick={() => signOut()}
                      >
                          Sign Out
                      </a>
                    )}
                </div>
                <div onClick={() => setIsOpen(prev => !prev)} className="md:hidden cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6h18M3 12h18M3 18h18"/>
                    </svg>
                </div>
            </nav>
            <div className="mt-11">
                {children}
            </div>
        </>
    )
}