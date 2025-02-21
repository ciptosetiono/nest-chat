"use client";
import { downloadFile as downloadFileService } from '../services/api';
import { File } from '../interfaces';
import Loader from './Loading';
import { useEffect, useState } from 'react';

export default function DownloadFile({ file }: {file : File}) {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(false);
  },[]);


  if(isLoading) return <Loader/>

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
        const fileData = await downloadFileService(token, file._id);

        if (!fileData) {
          throw new Error("File data is empty");
        }

        const url = window.URL.createObjectURL(new Blob([fileData], { type: file.mimetype }));
      
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      }
     
    } catch (err) {
      setError('Terjadi kesalahan, file gagal di download');
    }
  };

  return (
      <div>
        {error &&
        <div className="toast toast-start">
          <div className="alert alert-error">
            <span>{error}</span>
            <button onClick={() => setError('')} className="btn btn-sm btn-ghost ml-2">Close</button>
          </div>
        </div>
        }
        <button onClick={handleDownload} className="btn btn-ghost">
          Download
        </button>
      </div>

  );
}