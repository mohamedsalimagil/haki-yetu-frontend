import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ChatSidebar from '../../components/domain/chat/ChatSidebar';
import MessageWindow from '../../components/domain/chat/MessageWindow';
import socketService from '../../services/socket.service';
import chatService from '../../services/chat.service';
import clientService from '../../services/client.service';
import lawyerService from '../../services/lawyer.service';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]); // Fetch from API
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  // Deep link protection: Check for active bookings
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;

      try {
        let hasActiveBooking = false;

        if (user.role === 'client') {
          const bookings = await clientService.getMyBookings();
          hasActiveBooking = bookings.some(booking =>
            booking.status === 'Paid' || booking.status === 'Confirmed'
          );
        } else if (user.role === 'lawyer') {
          // Lawyers can access chat if they have any clients/orders
          const orders = await lawyerService.getOrders();
          hasActiveBooking = orders.length > 0;
        }

        if (!hasActiveBooking) {
          toast.error('Access denied. Please book a consultation first.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        toast.error('Error verifying access. Please try again.');
        navigate('/');
      }
    };

    checkAccess();
  }, [user, navigate]);

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

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, {
        sender_id: data.sender_id,
        content: data.message,
        created_at: data.timestamp
      }]);
    };
    const handleConnectError = (err) => {
      console.error('Socket connection rejected by server:', err.message);
      setSocketConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('connect_error', handleConnectError);

    // Check initial connection status
    setSocketConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  // Join room when activeContact changes
  useEffect(() => {
    if (activeContact && user) {
      const room = `chat_${Math.min(user.id, activeContact.id)}_${Math.max(user.id, activeContact.id)}`;
      socketService.socket.emit('join_room', { room });
    }
  }, [activeContact, user]);

  const fetchMessages = async () => {
    if (!activeContact) return;
    try {
      const response = await chatService.getMessages(activeContact.id);
      const data = response.data?.messages || response.data || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };

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
    setMessages(prev => [...prev, { sender_id: user.id, content: text, created_at: messageData.timestamp }]);
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
        onRefreshMessages={fetchMessages}
        socketConnected={socketConnected}
      />
    </div>
  );
};

export default ChatPage;
