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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
  <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Profile</h2>
  {profile ? (
    <div className="space-y-6">
      <div className="text-lg text-gray-700">
        <p><strong className="text-gray-900">Username:</strong> {profile.username}</p>
        <p><strong className="text-gray-900">Email:</strong> {profile.email}</p>
        <p><strong className="text-gray-900">Name:</strong> {profile.name}</p>
        <p><strong className="text-gray-900">Gender:</strong> {profile.gender}</p>
        <p><strong className="text-gray-900">Height:</strong> {profile.height}</p>
        <p><strong className="text-gray-900">Weight:</strong> {profile.weight}</p>
        <p><strong className="text-gray-900">Birth Date:</strong> {profile.birthDate}</p>
        <p><strong className="text-gray-900">Zodiac:</strong> {profile.zodiac}</p>
        <p><strong className="text-gray-900">Horoscope:</strong> {profile.horoscope}</p>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition ease-in-out duration-300"
        >
          Back
        </Link>

        <Link
          href="/user/update"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300"
        >
          Update Profile
        </Link>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">Loading profile...</p>
  )}
</div>
   );
 }