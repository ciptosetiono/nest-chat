"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Room } from "../interfaces";
import { getProfile , getRooms} from "../services/api";
import RoomList from "../components/RoomList";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // New state to handle loading
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          router.push("/auth/login");
          return;
        }; // No token, no need to fetch

        setToken(storedToken);

        //fetch user data
        const userData = await getProfile(storedToken);
        if(!userData){
          setError("Failed to fetch user data.");
        }
        setUser(userData);

      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  if (loading) return <p>Loading...</p>; // Prevent SSR mismatch

  return (
    <div className="p-6 max-w-xl mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      {user ? (
        <div>
          <h1 className="text-2xl font-bold">Chat App</h1>
          <p>Welcome, {user.username}</p>
             <Link href={'/user/profile'} className="bg-blue-500 text-white p-2 rounded mr-2">Profile</Link>
             <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Sign Out</button>
          <RoomList/>
        </div>
      ) : (
        <> <Link href={'/auth/login'} className="bg-blue-500 text-white p-2 rounded mr-2">Login</Link></>
      )}
    </div>
  );
}
