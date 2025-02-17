"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Room } from "../interfaces";
import { getProfile , getRooms} from "../services/api";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms]= useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // New state to handle loading
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return; // No token, no need to fetch

        setToken(storedToken);

        //fetch user data
        const userData = await getProfile(storedToken);
        setUser(userData);

        const roomsData = await getRooms(storedToken);   
        setRooms(roomsData);

      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>; // Prevent SSR mismatch

  console.log(rooms);

  return (
    <div className="p-6 max-w-xl mx-auto">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : user ? (
        <div>
          <h1 className="text-2xl font-bold">Chat App</h1>
          <p>Welcome, {user.username}</p>
          <button className="bg-red-500 text-white p-2 rounded">Sign Out</button>
          <Link href='/chat/create' className="bg-green-500 text-white p-2 rounded">New</Link>
          <ul>
            {rooms.map(room => (
              <li key={room._id}>
                <Link href={`/chat/${room._id}`} className="text-blue-500">{room.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button className="bg-blue-500 text-white p-2 rounded">Login</button>
      )}
    </div>
  );
}
