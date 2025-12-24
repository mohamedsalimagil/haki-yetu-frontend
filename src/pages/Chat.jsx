import React, { useState } from 'react';
import ChatSidebar from '../components/domain/chat/ChatSidebar';
import ChatWindow from '../components/domain/chat/ChatWindow';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?.id}
      />

      {/* Chat Window */}
      <ChatWindow selectedConversation={selectedConversation} />
    </div>
  );
};

export default Chat;
