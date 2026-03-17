"use client";

import {useState} from "react";
import {Input} from "@/components/optics/input";
import {Button} from "@/components/optics/button";

export default function ChatInput({onSend}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-4 bg-white/5 backdrop-blur-xl">
      <Input
        placeholder="Ask about expenses..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent border-white/10 focus:border-white/20"
      />

      <Button
        onClick={handleSend}
        className="bg-white/10 hover:bg-white/20 border border-white/10"
      >
        Send
      </Button>
    </div>
  );
}
