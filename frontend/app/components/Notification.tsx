export default function Notification({ message }:any) {
    if (!message) return null;
 
    return (
      <div className="fixed bottom-0 right-0 mb-4 mr-4 p-4 bg-blue-500 text-white rounded shadow-lg">
        <strong>{message.sender.username}</strong>: {message.content}
      </div>
    );
  }