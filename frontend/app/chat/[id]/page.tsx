"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useChat from "@/app/hooks/useChat";
import { Room, Chat, User } from "@/app/interfaces";
import { getRoomById } from "@/app/services/api";
import Notification from "@/app/components/Notification";

export default function DetailRoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); 
  const [room, setRoom] = useState<Room | null>(null); 
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState<Chat | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Get Token from LocalStorage
  useEffect(() => {
    const fetchRoom= async () => {
      const storedToken = localStorage.getItem("token"); 
      if (storedToken) {
        setToken(storedToken);
        const roomData = await getRoomById(storedToken, roomId);
        setRoom(roomData);
      }
    }
    fetchRoom();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as User);
      }
    }
  }, []);



  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleMoreMessages = () => {
    loadMoreMessages();   
  }

  const handleNotification = (chat: Chat) => {
    console.log(`sender: ${chat.sender._id}`);
    console.log(user);

    if(chat.sender._id != user?._id){
      setNotification(chat);
      setIsNotificationVisible(true);
    }
  }

  const handleCloseNotification = () => {
    setNotification(null);
  }


  // Initialize chat only when token & roomId exist
  const { displayedMessages, sendMessage, loadMoreMessages, hasMore } = useChat(roomId, token || null, handleNotification);

  if (!token || !room || !user) return <div>Loading...</div>;
  
  
  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          Back
        </button>
        <h1 className="text-xl font-bold">{room.name}</h1>
       
        <div></div> 
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg">
        {hasMore && (
          <button
            onClick={handleMoreMessages}
            className="block mx-auto mb-2 px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-500"
          >
            Load More
          </button>
        )}
        {displayedMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          displayedMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.sender.username}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
      <Notification chat={notification} onClose={handleCloseNotification}/>
    </div>
  );
}
