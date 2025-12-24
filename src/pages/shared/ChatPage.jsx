import React, { useState, useEffect } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import MessageWindow from '../../components/chat/MessageWindow';
import socketService from '../../services/socket.service';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]); // Fetch from API
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/chat/contacts');
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Failed to load contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, {
        sender_id: data.sender_id,
        text: data.message,
        timestamp: data.timestamp
      }]);
    });

    return () => socket.off('receive_message');
  }, []);

  // Join room when activeContact changes
  useEffect(() => {
    if (activeContact && user) {
      const room = `chat_${Math.min(user.id, activeContact.id)}_${Math.max(user.id, activeContact.id)}`;
      socketService.socket.emit('join_room', { room });
    }
  }, [activeContact, user]);

  const handleSendMessage = (text) => {
    const room = `chat_${Math.min(user.id, activeContact.id)}_${Math.max(user.id, activeContact.id)}`;
    const messageData = {
      room,
      sender_id: user.id,
      message: text,
      timestamp: new Date().toISOString()
    };
    socketService.socket.emit('send_message', messageData);

    // Optimistic Update
    setMessages(prev => [...prev, { sender_id: user.id, text, timestamp: messageData.timestamp }]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <ChatSidebar
        contacts={contacts}
        onSelectContact={setActiveContact}
        activeContactId={activeContact?.id}
        onlineUsers={onlineUsers}
      />
      <MessageWindow
        activeContact={activeContact}
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUserId={user.id}
      />
    </div>
  );
};

export default ChatPage;
