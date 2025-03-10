"use client";

import Link from 'next/link';
import { User } from '@/app/interfaces';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/app/services/api';
import Loader from '@/app/components/Loading';

 export default function RegisterPage() {
  const [user, setUser] = useState<User | null>(null);
   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const router = useRouter();

   
  useEffect(() =>{
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      router.push('/dashboard');
    };
  }, [router]);
   
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
       }, 1000);
     }catch (err: any) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("An unknown error occurred");
        }
       setSuccess('');
     }
   };

   if(isLoading) return <Loader/>
   
   return (
     <div className="flex items-center justify-center h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
         <h2 className="text-2xl font-bold text-center">Register</h2>
         <form className="space-y-6" onSubmit={handleSubmit}>
            <div>

            <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
                type="text"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </label>
           </div>
           <div>
            <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            </label>
           </div>
           <div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input
                type="password"
                className="grow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
           </div>
           <div>
             <button
               type="submit"
               className="btn btn-block btn-primary"
             >
               Register
             </button>
           </div>
           {error && <div  role="alert" className="alert alert-error">{error}</div>}
           {success && <div role="alert" className="alert alert-success">{success}</div>}
         </form>

         <div>
           already have an account?            
           <Link href="/auth/login" className='link link-primary'> Signin here</Link>
         </div>
       </div>
     </div>
   );
 }