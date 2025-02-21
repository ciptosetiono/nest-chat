"use client";

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { User } from "../interfaces";
import Loader from "./Loading";
import { logout } from "../services/api";
import Link from "next/link";

const NavbarSkeleton = () => {
    return <div className="skeleton h-15 w-100"></div>;
}
export const Navbar = () => {
     const [user, setUser] = useState<User | null>(null);
     const [isLoading, setIsLoading] = useState(true);


     useEffect(() => {
        const getStorageUser = () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                if (storedUser) {
                    setUser(storedUser);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };

        getStorageUser();

        const handleStorageChange = () => {
            getStorageUser();
        };

        window.addEventListener("userUpdated", handleStorageChange);

        return () => {
            window.removeEventListener('userUpdated', handleStorageChange);
        };
    }, []);

    
    if(isLoading) return <NavbarSkeleton/>

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href='/' className="btn btn-ghost text-xl">Nest Chat</Link>
            </div>
            <div className="flex-none">
               
                {user? (
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link href='/dashboard'>Dashboard</Link>
                        </li>
                        <li>
                            <details>
                            <summary className="flex items-center gap-2 cursor-pointer">
                                Chat Rooms
                            </summary>
                            <ul className="bg-base-100 rounded-t-none p-2">
                                <li><Link href='/chat'>All Room</Link></li>
                                <li><Link href='/chat/my-room'>My Room</Link></li>
                            </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                            <summary className="flex items-center gap-2 cursor-pointer">
                                <UserCircle size={30} className="text-gray-400" />
                                {user.username}
                            </summary>
                            <ul className="bg-base-100 rounded-t-none p-2">
                                <li><Link href='/user/profile'>Profile</Link></li>
                                <li><a onClick={logout}>Logout</a></li>
                            </ul>
                            </details>
                        </li>      
                    </ul>
                ): (
                    <a className="btn btn-primary" href='/auth/login'>Login</a>
                )}

            </div>
        </div>
    )
}