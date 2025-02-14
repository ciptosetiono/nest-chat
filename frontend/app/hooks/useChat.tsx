import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import {Chat } from "../interfaces";

const MESSAGES_PER_PAGE = 20;

const useChat = (roomId: string, token: string | null) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!token || !roomId) return; // ✅ Prevent unnecessary re-renders

    const newSocket: Socket = io("http://localhost:3030", {
      auth: { token },
    });

    setSocket(newSocket);

    //join room
    newSocket.emit("joinRoom", {roomId});


    //after join room, receive old message from backend
    newSocket.on("oldMessages", async ({ messages: newMessages, totalMessages }) => {

      //reverse the message so the newst at the bottom page
      await newMessages.reverse();    

      //apply new message to current message
      setMessages((prev) => [...newMessages, ...prev]);
      if (messages.length + newMessages.length >= totalMessages) {
        setHasMore(false);
      }
    });

    // ✅ Handle incoming messages
    newSocket.on("receiveMessage", (newMessage: Chat) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.off("receiveMessage");
      newSocket.disconnect();
    };
  }, [token, roomId]);

   // handle load more (message pagination)
   const loadMoreMessages = (socketInstance?: Socket, nextPage?: number) => {
    if (!socket && !socketInstance) return;
    if (!hasMore) return;

    const targetSocket = socketInstance || socket;
   
    targetSocket!.emit("loadMessages", { roomId, page: nextPage || page + 1, limit: MESSAGES_PER_PAGE });

    setPage((prev) => prev + 1);
  };

  // send message
  const sendMessage = (message: string) => {
    if (!socket) {
      console.warn("Socket not connected yet.");
      return;
    }
    socket.emit("sendMessage", { room: roomId, content: message });
  };

  return { messages, sendMessage, loadMoreMessages: loadMoreMessages || (() => {}), hasMore };
};

export default useChat;
