"use client";

import {useState} from "react";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, please ask me to create expenses, list expenses, or perform analytics.",
    },
  ]);

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
    <div className="flex flex-col h-full border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center mt-10">
            Ask anything about your expenses 💬
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/10">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
