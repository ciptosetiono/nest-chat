"use client";
import { useState, useEffect } from 'react';
import { createRoom } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { Room } from '@/app/interfaces';

export default function CreateChatForm() {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
    useEffect(() => {
      const storageToken = localStorage.getItem('token');
      if(storageToken){
        setToken(storageToken);
      }
    }, []);

    if(!token) return'';

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
       const token = localStorage.getItem('token');
     
       let membersId: string[] = [];
       if(members!=''){
        membersId = members.split(',').map(id => id.trim());
       }
       const createdRoom: Room =  await createRoom(token, name, membersId);
       setError('');
       setMessage('Chat created successfully');
       router.push(`/chat/${createdRoom._id}`);   
     } catch (err: any) {
        const errorMessages = err.response?.data?.message;
        if(errorMessages ){
          console.log(errorMessages[0]);
          setError(err.response.data.message[1]);
        }else{
          setError(`Error: failed to create room`);
        }
        setMessage('');
      
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
         <button type="button" onClick={() => router.back()} className="btn">
           Back
         </button>
         <button type="submit" className="btn btn-accent">
           Create
         </button>
        
       </form>
       {message && <div role="alert" className="alert alert-success">{message}</div>}
       {error && <div role="alert" className="alert alert-error">{error}</div>}
     </div>
   );
 }