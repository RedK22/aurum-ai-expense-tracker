"use client";

import {useState} from "react";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text) => {
    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://localhost:8000/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.message,
        expenses: data.expenses || null,
        expenseCreated: data.expense || null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-xl bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
