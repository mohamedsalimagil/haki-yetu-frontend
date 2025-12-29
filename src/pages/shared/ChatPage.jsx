import React, { useState, useEffect } from 'react';
import ChatSidebar from '../../components/domain/chat/ChatSidebar';
import MessageWindow from '../../components/domain/chat/MessageWindow';
import socketService from '../../services/socket.service';
import chatService from '../../services/chat.service';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { user, token } = useAuth();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // --- 1. CONNECTION & LISTENER ---
  useEffect(() => {
    if (!token) return;

    if (!socketService.socket) {
      socketService.connect(token);
    }
    const socket = socketService.socket;

    const onConnect = () => {
      console.log("🟢 Connected to Socket");
      setSocketConnected(true);
    };
    const onDisconnect = () => {
      console.log("🔴 Disconnected");
      setSocketConnected(false);
    };

    // THE UNIVERSAL LISTENER (Catches everything)
    const handleAnyMessage = (data) => {
      console.log("🔥 INBOUND MESSAGE RECEIVED:", data);

      let cleanMessage = {};
      // Handle different data formats the backend might send
      if (typeof data === 'string') {
        cleanMessage = { content: data, sender_id: 0, created_at: new Date().toISOString() };
      } else {
        cleanMessage = {
          ...data,
          sender_id: data.sender_id || 0,
          content: data.text || data.message || data.content || "Unknown Message",
          created_at: data.timestamp || new Date().toISOString()
        };
      }

      setMessages((prev) => {
        // Dedup logic: precise timestamp check to avoid double-rendering
        const exists = prev.some(m =>
          m.content === cleanMessage.content &&
          Math.abs(new Date(m.created_at) - new Date(cleanMessage.created_at)) < 500
        );
        if (exists) return prev;
        return [...prev, cleanMessage];
      });
    };

    if (socket) {
      setSocketConnected(socket.connected);
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      // LISTEN TO EVERYTHING
      socket.on('receive_message', handleAnyMessage);
      socket.on('message', handleAnyMessage);
      socket.on('response', handleAnyMessage);
      socket.on('chat', handleAnyMessage);
    }

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('receive_message', handleAnyMessage);
        socket.off('message', handleAnyMessage);
        socket.off('response', handleAnyMessage);
        socket.off('chat', handleAnyMessage);
      }
    };
  }, [token]);

  // --- 2. JOIN ROOM ---
  useEffect(() => {
    if (!activeContact || !user || !socketService.socket) return;

    const userId = parseInt(user.id);
    const contactId = parseInt(activeContact.id);
    // Secure Room Name
    const room = `chat_${Math.min(userId, contactId)}_${Math.max(userId, contactId)}`;

    const joinRoom = () => {
      console.log(`🔌 Joining Room: ${room}`);
      // Join using both common event names
      socketService.socket.emit('join_room', { room });
      socketService.socket.emit('join', { room });
    };

    if (socketService.socket.connected) {
      joinRoom();
    } else {
      socketService.socket.on('connect', joinRoom);
    }

    // Clear previous chat when switching
    setMessages([]);

    return () => {
      socketService.socket?.off('connect', joinRoom);
    };
  }, [activeContact, user]);


  // --- 3. SEND MESSAGE ---
  const handleSendMessage = (text) => {
    if (!activeContact) return;

    const userId = parseInt(user.id);
    const contactId = parseInt(activeContact.id);
    const room = `chat_${Math.min(userId, contactId)}_${Math.max(userId, contactId)}`;

    const payload = {
      room,
      sender_id: userId,
      recipient_id: contactId,
      message: text,
      content: text,
      text: text, // Redundant keys to satisfy any backend requirement
      timestamp: new Date().toISOString()
    };

    console.log("📤 Sending Payload:", payload);

    // SEND TO ALL POSSIBLE ENDPOINTS
    socketService.socket?.emit('send_message', payload);
    socketService.socket?.emit('message', payload);

    // Optimistic Update
    setMessages(prev => [...prev, {
      sender_id: userId,
      content: text,
      created_at: new Date().toISOString()
    }]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">
      <div className={`w-full md:w-80 flex-shrink-0 flex-col bg-white border-r border-gray-200 ${showSidebar ? 'flex' : 'hidden md:flex'}`}>
        <ChatSidebar
          onSelectContact={(c) => { setActiveContact(c); setShowSidebar(false); }}
          activeContactId={activeContact?.id}
          mobileView={true}
          onBack={() => {}}
        />
      </div>
      <div className={`flex-1 flex-col bg-white ${!showSidebar ? 'flex' : 'hidden md:flex'}`}>
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
