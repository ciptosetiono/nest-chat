"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useChat from "@/app/hooks/useChat";
import { Room, Chat, User, File } from "@/app/interfaces";
import { getRoomById } from "@/app/services/api";
import ChatForm from "@/app/components/ChatForm";
import Notification from "@/app/components/Notification";
import UploadFile from '@/app/components/UploadFile';
import DownloadFile from '@/app/components/DownloadFile';
import ChatItem from "@/app/components/ChatItem";

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
    if(chat.sender._id != user?._id){
      setNotification(chat);
      setIsNotificationVisible(true);
    }
  }

  const handleCloseNotification = () => {
    setNotification(null);
  }


  // Initialize chat only when token & roomId exist
  const { displayedMessages, sendMessage, sendFile, loadMoreMessages, hasMore } = useChat(roomId, token || null, handleNotification);

  if (!token || !room || !user) return <div>Loading...</div>;
  
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold mx-auto">{room.name}</h1>
        <div></div> 
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg">
        {hasMore && (
          <button
            onClick={handleMoreMessages}
            className="btn"
          >
            Load More
          </button>
        )}
        {displayedMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          displayedMessages.map((msg: Chat, index) => (
            <div key={index}>
              <ChatItem username={msg.sender.username} message={msg.content} time={msg.createdAt.toString()}/>
              {msg.files?.map(file => (
                 <DownloadFile key={file._id} file={file}/>
              ))}
            </div>
          ))
        )}
      </div>
      <UploadFile roomId={roomId} onSubmit={sendFile}/>
      <ChatForm
        value={newMessage}
        onChange={(e) => setNewMessage((e.target as HTMLInputElement).value)}
        onSubmit={handleSendMessage}
      />
      <Notification chat={notification} onClose={handleCloseNotification}/>
    
    </div>
  );
}
