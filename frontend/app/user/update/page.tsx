
"use client";
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/app/services/api';
import Link from 'next/link';
 export default function UpdateProfileForm() {
   const [username, setUsername] = useState('');
   const [name, setName] = useState('');
   const [birthDate, setBirthDate] = useState('');
   const [gender, setGender] = useState('');
   const [height, setHeight] = useState('');
   const [weight, setWeight] = useState('');
   const [message, setMessage] = useState('');

   useEffect(() => {
    const fetchProfile = async () => {
      try {
         const token = localStorage.getItem('token');
      
         if (token) {
           const data = await getProfile(token);
        
            setUsername(data.username);

            if(data.name){
              setName(data.name);
            }

            if(data.birthDate){
              setBirthDate(data.birthDate);
            }

            if(data.gender){
              setGender(data.gender);
            }

            if(data.height){
              setHeight(data.height);
            }

            if(data.weight){
              setWeight(data.weight);
            }
         }
      } catch (err:unknown) {
        if (err instanceof Error) {
          setMessage(`Error: ${err.message}`);
        }else{
          setMessage(`Unknown Error`);
        }
     }
    };

     fetchProfile();
   }, []);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
       const token = localStorage.getItem('token');
   
       const userData = { username,  name, birthDate, gender, height, weight };
       const data = await updateProfile(token, userData);
       setMessage('Profile updated successfully');
     } catch (error:any) {
       setMessage(`Error: ${error.message}`);
     }
   };

   return (
     <div className="max-w-md mx-auto mt-10">
       <h2 className="text-2xl font-bold mb-5">Update Profile</h2>
       <form onSubmit={handleSubmit}>
        <div className="mb-4">
           <label className="block text-gray-700">Username</label>
           <input
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-700">Name</label>
           <input
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-700">Birth Day</label>
           <input
             type="text"
             value={birthDate}
             onChange={(e) => setBirthDate(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700">Gender</label>
           <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full -3 py-2 border rounded"
            >
            <option value="Man">Man</option>
            <option value="Women">Women</option>
          </select>
         </div>

         <div className="mb-4">
           <label className="block text-gray-700">Height</label>
           <input
             type="text"
             value={height}
             onChange={(e) => setHeight(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700">Weight</label>
           <input
             type="text"
             value={weight}
             onChange={(e) => setWeight(e.target.value)}
             className="w-full px-3 py-2 border rounded"
           />
         </div>

         <Link
            href="/user/profile"
            className="px-6 py-3 transition"
          >
            Back
          </Link>
         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
           Update
         </button>
        
       </form>
       {message && <div className="mt-4 text-red-500">{message}</div>}
     </div>
   );
 }