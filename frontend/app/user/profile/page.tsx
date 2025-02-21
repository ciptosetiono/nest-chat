"use client";
import { useEffect, useState } from 'react';
import { getProfile } from '@/app/services/api';
import Link from 'next/link';
import Image from "next/image";
import { UserCircle } from "lucide-react";
import Loader from '@/app/components/Loading';

 export default function Profile() {
  const [user, setUser] = useState<any>(null);
   
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

   useEffect(() => {
     const fetchUser= async () => {
       try {
         const token = localStorage.getItem('token');;
         if (token) {
           const data = await getProfile(token);
           setUser(data);
         } else {
           setError('No token found');
         }
       } catch (err: any) {
         setError(err.message);
       }
       setIsLoading(false);
     };
     fetchUser();
   }, []);

  if (isLoading)   {
    return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
    );
  }

  if (error) {
    return <div role="alert" className="alert alert-error">{error}</div>;
  }


   return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl p-5">
        <div className="flex flex-col items-center">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-primary"
          />
        ) : (
          <UserCircle size={80} className="text-gray-500" />
        )}

        <h2 className="text-xl font-semibold mt-3">{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>

        {user.bio && <p className="mt-2 text-center text-gray-600">{user.bio}</p>}

        <div className="mt-4 text-sm text-gray-700 w-full">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Birthday:</span>
              <span>{user.birthdate || "Not set"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Height:</span>
              <span>{user.weight ? `${user.height} cm` : "Not set"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Weight:</span>
              <span>{user.weight ? `${user.weight} kg` : "Not set"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">zodiac:</span>
              <span>{user.weight ? `${user.zodiac}` : "Not set"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">chinese zodiac:</span>
              <span>{user.weight ? `${user.horoscope}` : "Not set"}</span>
            </div>
          
          </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link className="btn btn-primary" href='/user/update'> Edit Profile</Link>
        </div>
      </div>
      </div>
    </div>
   );
 }