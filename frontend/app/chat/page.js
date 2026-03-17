import ChatContainer from "@/components/chat/chat-container";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] flex justify-center px-4">
      <div className="w-full max-w-3xl h-full py-6">
        <ChatContainer />
      </div>
    </div>
  );
}