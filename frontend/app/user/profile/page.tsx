"use client";
import { useEffect, useState } from 'react';
import { getProfile } from '@/app/services/api';
import Link from 'next/link';

 export default function Profile() {
   const [profile, setProfile] = useState<any>(null);
   const [error, setError] = useState('');

   useEffect(() => {
     const fetchProfile = async () => {
       try {
         const token = localStorage.getItem('token');;
         if (token) {
           const data = await getProfile(token);
           setProfile(data);
         } else {
           setError('No token found');
         }
       } catch (err: any) {
         setError(err.message);
       }
     };

     fetchProfile();
   }, []);

   if (error) {
     return <div className="text-red-500">{error}</div>;
   }

   return (
     <div className="max-w-md mx-auto mt-10">
       <h2 className="text-2xl font-bold mb-5">Profile</h2>
       {profile ? (
         <div>
           <p><strong>Username:</strong> {profile.username}</p>
           <p><strong>Email:</strong> {profile.email}</p>
           <p><strong>Name:</strong> {profile.name}</p>
           <p><strong>Gender:</strong> {profile.gender}</p>
           <p><strong>Birth Date:</strong> {profile.birthDate}</p>
           <p><strong>Height:</strong> {profile.height}</p>
           <p><strong>Weight:</strong> {profile.weight}</p>
           <div className="flex justify-center items-center h-screen">
          <Link
            href="/user/update"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </Link>
         </div>

         </div>
       ) : (
         <p>Loading...</p>
       )}
     </div>
   );
 }