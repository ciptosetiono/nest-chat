"use client";
import { useState } from 'react';
import { createRoom } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { Room } from '@/app/interfaces';

export default function CreateChatForm() {
   const [name, setName] = useState('');
   const [members, setMembers] = useState('');
   const [message, setMessage] = useState('');
   const router = useRouter();
  
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
       const token = localStorage.getItem('token');
     
       let membersId: string[] = [];
       if(members!=''){
        membersId = members.split(',').map(id => id.trim());
       }
       const createdRoom: Room =  await createRoom(token, name, membersId);
       console.log(createdRoom);
       setMessage('Chat created successfully');
       router.push(`/chat/${createdRoom._id}`);
       
     } catch (err: unknown) {
        setMessage(`Error: gagal mengirim pesan`);
     }
   };

   return (
     <div className="max-w-md mx-auto mt-10">
       <h2 className="text-2xl font-bold mb-5">Create Chat Room</h2>
       <form onSubmit={handleSubmit}>
        <div className="mb-4">
           <label className="block text-gray-700">Room Name</label>
           <input
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-700">Members</label>
           <input
             type="text"
             value={members}
             onChange={(e) => setMembers(e.target.value)}
             className="w-full px-3 py-2 border rounded"
             placeholder="Comma-separated user IDs"
           />
         </div>
         <button type="button" onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">
           Back
         </button>
         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
           Create
         </button>
        
       </form>
       {message && <p className="mt-4">{message}</p>}
     </div>
   );
 }