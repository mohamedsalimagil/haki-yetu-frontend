import React, { useState, useEffect } from 'react';
import ChatSidebar from '../../components/domain/chat/ChatSidebar';
import MessageWindow from '../../components/domain/chat/MessageWindow';
import socketService from '../../services/socket.service';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { user, token } = useAuth();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  // Initialize with the real current state, not just false
  const [socketConnected, setSocketConnected] = useState(socketService.socket?.connected || false);
  const [showSidebar, setShowSidebar] = useState(true);

  // --- 1. CONNECTION & LISTENER ---
  useEffect(() => {
    if (!token) return;

    // Connect if needed
    if (!socketService.socket) {
      socketService.connect(token);
    }
    const socket = socketService.socket;

    // Update state immediately if already connected
    if (socket.connected) setSocketConnected(true);

    // Event Handlers
    const onConnect = () => {
      console.log("🟢 Socket Connected Event");
      setSocketConnected(true);
      joinTestLobby(); // Re-join on reconnect
    };
    
    const onDisconnect = () => {
      console.log("🔴 Socket Disconnected Event");
      setSocketConnected(false);
    };

    const onMessage = (newMsg) => {
      console.log("📩 INBOUND:", newMsg);
      setMessages((prev) => {
        // Prevent duplicates
        const exists = prev.some(m => 
          m.content === (newMsg.text || newMsg.content) && 
          Math.abs(new Date(m.created_at) - new Date()) < 2000
        );
        if (exists) return prev;

        return [...prev, {
          ...newMsg,
          sender_id: newMsg.sender_id,
          content: newMsg.text || newMsg.content || newMsg.message,
          created_at: new Date().toISOString()
        }];
      });
    };

    // Attach Listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onMessage);

    // Join the lobby immediately
    joinTestLobby();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onMessage);
    };
  }, [token]);

  // --- 2. JOIN STRATEGY ---
  const joinTestLobby = () => {
    if (socketService.socket) {
      // Force everyone into one room for the test
      const room = "test_lobby";
      console.log(`🔌 Joining Global Room: ${room}`);
      socketService.socket.emit('join_room', { room });
    }
  };

  // --- 3. SEND STRATEGY ---
  const handleSendMessage = (text) => {
    if (!text) return;

    // We use the same room name as we joined
    const room = "test_lobby"; 

    const payload = {
      room, 
      sender_id: user.id,
      // We use a fake recipient ID because in a global lobby it doesn't matter
      recipient_id: 999, 
      message: text,
      content: text,
      timestamp: new Date().toISOString()
    };

    console.log("📤 Sending:", payload);
    socketService.socket?.emit('send_message', payload);

    // Optimistic Update (Show it on my screen immediately)
    setMessages(prev => [...prev, {
      sender_id: user.id,
      content: text,
      created_at: new Date().toISOString()
    }]);
  };

  // --- 4. VIEW HELPERS ---
  const handleContactSelect = (contact) => {
    // We accept the contact selection just to switch the view, 
    // but we ignore the ID and stay in the "test_lobby"
    setActiveContact(contact);
    setShowSidebar(false);
    // Clear messages to give a clean slate for the test
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">
      <div className={`w-full md:w-80 flex-shrink-0 flex-col bg-white border-r border-gray-200 ${showSidebar ? 'flex' : 'hidden md:flex'}`}>
        <ChatSidebar 
          onSelectContact={handleContactSelect}
          activeContactId={activeContact?.id}
          mobileView={true} 
          onBack={() => {}} 
        />
      </div>
      <div className={`flex-1 flex-col bg-white ${!showSidebar ? 'flex' : 'hidden md:flex'}`}>
        {/* Red Bar Removed as requested */}
        
        <MessageWindow 
          activeContact={activeContact}
          socket={socketService.socket}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={user?.id}
          socketConnected={socketConnected}
          mobileView={!showSidebar}
          onBackToContacts={() => { setActiveContact(null); setShowSidebar(true); }}
        />
      </div>
    </div>
  );
};

export default ChatPage;