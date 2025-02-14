"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/app/services/api';

 export default function RegisterPage() {
   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
       await register(email, username, password);
       setSuccess('Registration successful! You can now login.');
       setUsername('');
       setPassword('');
       setError('');
       setTimeout(() => {
         router.push('/auth/login');
       }, 2000);
     }catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
       setSuccess('');
     }
   };

   return (
     <div className="flex items-center justify-center h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
         <h2 className="text-2xl font-bold text-center">Register</h2>
         <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
             <label className="block text-gray-700">Email</label>
             <input
               type="text"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-3 py-2 border rounded"
               required
             />
           </div>
           <div>
             <label className="block text-gray-700">Username</label>
             <input
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full px-3 py-2 border rounded"
               required
             />
           </div>
           <div>
             <label className="block text-gray-700">Password</label>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-3 py-2 border rounded"
               required
             />
           </div>
           <div>
             <button
               type="submit"
               className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
             >
               Register
             </button>
           </div>
           {error && <div className="text-red-500">{error}</div>}
           {success && <p className="text-green-500">{success}</p>}
         </form>
       </div>
     </div>
   );
 }