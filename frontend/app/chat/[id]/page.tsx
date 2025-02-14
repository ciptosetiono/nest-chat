"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useChat from "@/app/hooks/useChat";

export default function DetailRoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const [token, setToken] = useState<string | null>(null); 
  const [newMessage, setNewMessage] = useState("");

  // Get Token from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  // Initialize chat only when token & roomId exist
  const { messages, sendMessage, loadMoreMessages, hasMore } = useChat(roomId, token || null);

  if (!roomId) return <div>Invalid Room</div>;
  if (!token) return <div>Loading...</div>;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleMoreMessages = () => {
    loadMoreMessages();
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg">
        {hasMore && (
          <button
            onClick={handleMoreMessages}
            className="block mx-auto mb-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Load More
          </button>
        )}
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
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
    </div>
  );
}
