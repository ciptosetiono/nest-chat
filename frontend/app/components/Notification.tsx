"use client";

import { Chat } from "../interfaces";
import { useState } from "react";
export default function Notification({chat, onClose}:{chat:Chat | null, onClose: () => void} ) {

    if (!chat) return null;

    return (
      <div className="fixed bottom-10 left-0 mb-4 ml-4 p-4 bg-green-500 text-white rounded shadow-lg">
        <button 
          className="absolute top-0 right-0 mt-2 mr-2 text-white" 
          onClick={() => onClose()}
        >
          &times;
        </button>
        <strong>{chat.sender.username}</strong>: {chat.content}
      </div>
    );
  }