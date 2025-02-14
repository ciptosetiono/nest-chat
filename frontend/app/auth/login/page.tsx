"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/api';

 export default function LoginPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
       const data = await login(email, password);
       console.log(data);
       localStorage.setItem('user', data.user);
       localStorage.setItem('token', data.accessToken);
       router.push('/user/profile');
     }catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
     }
   };

   return (
     <div className="flex items-center justify-center h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
         <h2 className="text-2xl font-bold text-center">Login</h2>
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
               Login
             </button>
           </div>
           {error && <div className="text-red-500">{error}</div>}
         </form>
       </div>
     </div>
   );
 }