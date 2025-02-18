import { downloadFile as downloadFIleService } from '../services/api';
import { File } from '../interfaces';

export default function DownloadFile({ file }: {file : File}) {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
        const fileData = await downloadFIleService(token, file._id);

        const url = window.URL.createObjectURL(new Blob([fileData]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
      }
     
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  return (
    <div className="mb-2">
      <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
        Download {file.filename}
      </button>
    </div>
  );
}