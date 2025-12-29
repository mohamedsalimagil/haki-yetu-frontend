import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket.service';
import { Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
  const { user, token } = useAuth();
  const [activeContact, setActiveContact] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // MOCK DATA: In Production, this comes from Person B's endpoint (GET /api/conversations)
  // We include 'conversation_id' here to satisfy the strict backend contract.
  const contacts = [
    {
      id: 1,
      conversation_id: 101, // This ID must exist in DB for chat to work
      name: "Adv. Wanjiku Kimani",
      role: "Corporate Law",
      avatar: "WK",
      online: true
    },
    {
      id: 2,
      conversation_id: null, // Simulate a contact with NO active booking/conversation
      name: "Adv. Peter Omondi",
      role: "Civil Litigation",
      avatar: "PO",
      online: false
    },
  ];

  // --- 1. CONNECT & LISTEN ---
  useEffect(() => {
    if (!token) return;

    socketService.connect(token);
    const socket = socketService.socket;

    const onConnect = () => {
      console.log("🟢 Connected to Socket");
      setIsConnected(true);
    };
    const onDisconnect = () => {
      console.log("🔴 Disconnected");
      setIsConnected(false);
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
      setIsConnected(socket.connected);
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

  // --- 2. JOIN CONVERSATION (Strict Mode) ---
  useEffect(() => {
    if (!activeContact || !user || !socketService.socket) return;

    if (activeContact.conversation_id) {
        // Emit 'join_conversation' as required by events.py
        socketService.socket.emit('join_conversation', {
            conversation_id: activeContact.conversation_id,
            user_id: user.id
        });
        setMessages([]); // Clear view on switch
    }
  }, [activeContact, user]);

  // --- 3. AUTO SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeContact) return;

    // Guard: Cannot chat without a conversation ID (Backend Requirement)
    if (!activeContact.conversation_id) {
        toast.error("No active booking/conversation found with this user.");
        return;
    }

    // Emit 'send_message' matching events.py signature
    const payload = {
      conversation_id: activeContact.conversation_id,
      sender_id: user.id,
      message: messageText,
      message_type: 'text'
    };

    socketService.socket.emit('send_message', payload);
    setMessageText("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans">

      {/* SIDEBAR */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
             <input type="text" placeholder="Search..." className="w-full bg-gray-50 border p-2 rounded text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`p-4 flex gap-3 cursor-pointer hover:bg-blue-50 transition ${activeContact?.id === contact.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {contact.avatar}
                </div>
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">{contact.name}</h3>
                <p className="text-xs text-gray-400">{contact.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      {activeContact ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
             <h3 className="font-bold text-gray-900">{activeContact.name}</h3>
             {!activeContact.conversation_id && (
                 <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
                     <AlertCircle size={12}/> No Active Booking
                 </span>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === user.id;
              return (
                <div key={index} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={activeContact.conversation_id ? "Type a message..." : "Booking required to chat"}
                  disabled={!activeContact.conversation_id}
                  className="flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed"
                />
                <button type="submit" disabled={!activeContact.conversation_id} className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                    <Send size={18} />
                </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
           Select a conversation
        </div>
      )}
    </div>
  );
};

export default ChatPage;
