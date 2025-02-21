import { useState, ChangeEvent, FormEvent } from 'react';
import { uploadFile as uploadService } from '../services/api';

interface UploadFileProps {
  roomId: string;
  onSubmit: (file:File) => void
}

export default function UploadFile({roomId, onSubmit}: UploadFileProps) {
  const [file, setFile] = useState<File | null>(null); 
  const [message, setMessage] = useState<string>(''); 


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if(file){
      onSubmit(file);
    }
  };

  return (
    <div className="flex justify-end">
      <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} className="file-input file-input-bordered file-input-accent file-input-xs"/>
      <button type="submit" className="btn btn-accent btn-outline btn-xs">
        Send File
      </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
