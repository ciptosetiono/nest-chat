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

  if (!profile) {
    return <div>Loading...</div>;
  }

   return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">Profile</h2>
      {profile ? (
        <div className="space-y-4">
        <p className="text-lg"><strong>Username:</strong> {profile.username}</p>
        <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
        <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
        <p className="text-lg"><strong>Gender:</strong> {profile.gender}</p>
        <p className="text-lg"><strong>Birth Date:</strong> {profile.birthDate}</p>
        <p className="text-lg"><strong>Height:</strong> {profile.height}</p>
        <p className="text-lg"><strong>Weight:</strong> {profile.weight}</p>
        <div className="flex justify-center mt-6">
        <Link
            href="/dashboard"
            className="px-2 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-700 transition"
         >
          Back
         </Link>
         
         <Link
            href="/user/update"
            className="px-2 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition"
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