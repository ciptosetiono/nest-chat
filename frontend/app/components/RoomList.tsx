"use client";
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRooms, getMyRooms} from '../services/api';
import { Room } from '../interfaces';

export default function RoomList({filterByUser}: {filterByUser: boolean}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
       const fetchRooms = async () => {
         try {
           const token = localStorage.getItem('token');
           if (token) {
            let data;
              if(filterByUser){
                data = await getMyRooms(token);
              }else{
                data = await getRooms(token);
              }

              if(data){
                setRooms(data);
              }
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
    <div>
      <Link href='/chat/create' className='btn btn-accent float-right'>New</Link>
       <input
         type="text"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         className="w-full px-3 py-2 border rounded mb-5"
         placeholder="Search room..."
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