import ChatContainer from "@/components/chat/chat-container";

export default function ChatPage() {
  return (
    <div className="h-screen flex justify-center items-center bg-muted/40">
      <div className="w-full max-w-2xl h-[80vh]">
        <ChatContainer />
      </div>
    </div>
  );
}
