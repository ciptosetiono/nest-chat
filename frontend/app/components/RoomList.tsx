"use client";
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRooms } from '../services/api';
import { Room } from '../interfaces';

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
       const fetchRooms = async () => {
         try {
           const token = localStorage.getItem('token');
           if (token) {
             const data = await getRooms(token);
             setRooms(data);
           } else {
             setError('No token found');
           }
         } catch (err:unknown) {
            if (err instanceof Error) {
              setError(err.message);
            }else{
              setError('Unknown Error');
            }

         }
       };
  
       fetchRooms();
     }, []);
  
     const filteredRooms = rooms.filter((room: Room) =>
       room.name.includes(search.toLowerCase())
     );
  
     const handleChatClick = (roomId: string) => {
       router.push(`/chat/${roomId}`);
     };
  
     if (error) {
       return <div className=" max-w-md mx-auto mt-10 text-red-500">{error}</div>;
     }
  
  return (
    <div className='mt-10'>
      <h2 className="text-2xl font-bold mb-5">Chat Rooms</h2>
      <Link href='/chat/create' className='ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>New Chat</Link>
     
       <input
         type="text"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         className="w-full px-3 py-2 border rounded mb-5"
         placeholder="Search chats..."
       />
       {filteredRooms.length > 0 ? (
         <ul>
           {filteredRooms.map((room:Room)=> (
             <li
               key={room._id}
               className="mb-2 p-2 border rounded cursor-pointer"
               onClick={() => handleChatClick(room._id)}
             >
               {room.name}
             </li>
           ))}
         </ul>
       ) : (
         <p>No chats available.</p>
       )}
    </div>
  );
}