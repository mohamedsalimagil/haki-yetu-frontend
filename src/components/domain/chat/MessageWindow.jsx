import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Paperclip, FileText, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chat.service';

// 1. Added activeConversationId to props
const MessageWindow = ({ 
  activeContact, 
  activeConversationId, 
  socket, 
  messages, 
  onSendMessage, 
  currentUserId, 
  onRefreshMessages, 
  mobileView, 
  onBackToContacts 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isActuallyConnected, setIsActuallyConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen to socket connection changes
  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setIsActuallyConnected(true);
    const handleDisconnect = () => setIsActuallyConnected(false);
    
    // Check initial state
    setIsActuallyConnected(socket.connected);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  // Handle File Selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { 
        alert("File size too large (Max 5MB)");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle Send
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || isUploading) return;

    // Safety Check: We need a conversation ID to send anything now
    if (!activeConversationId) {
      console.error("No active conversation ID found");
      alert("Error: Cannot send message without an active conversation.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload File
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('conversation_id', activeConversationId); 
          
          await chatService.uploadFile(formData);
          if (onRefreshMessages) onRefreshMessages();
        } catch (error) {
          console.error("File upload error:", error);
          alert("Failed to upload file.");
          setIsUploading(false);
          return;
        }
      }

      // 2. Send Text
      if (newMessage.trim()) {
        const textToSend = newMessage.trim();

        onSendMessage(textToSend); 
      }

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Send failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to render message content
  const renderMessageContent = (input) => {
    if (!input) return null;
    const text = String(input);

    if (text.startsWith('FILE:')) {
      const filename = text.replace('FILE:', '');
      const isImage = filename.match(/\.(jpeg|jpg|gif|png|webp)$/i);
      // Ensure this URL matches your backend config
      const url = `http://127.0.0.1:5000/chat/uploads/${filename}`;

      if (isImage) {
        return (
          <div className="mt-2">
            <img src={url} alt="Attachment" className="max-w-full sm:max-w-[250px] rounded-lg border border-white/20" loading="lazy" />
          </div>
        );
      } else {
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 mt-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10">
            <div className="p-2 bg-white rounded-full text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium truncate max-w-[150px]">{filename}</span>
          </a>
        );
      }
    }
    return <p className="whitespace-pre-wrap break-words">{text}</p>;
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center shadow-sm">
        {mobileView && (
           <button onClick={onBackToContacts} className="mr-3 text-blue-600 font-bold text-sm">Back</button>
        )}
        
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500 overflow-hidden">
          {activeContact.avatar ? (
            <img src={activeContact.avatar} alt={activeContact.first_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">
            {activeContact.first_name || activeContact.name} {activeContact.last_name || ''}
          </h2>
          <div className="flex items-center">
            {isActuallyConnected ? (
              <p className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Socket Connected
              </p>
            ) : (
              <p className="text-xs text-orange-400 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-1"></span>
                Connecting...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.map((msg, idx) => {
          // Robust check for sender_id (handles int/string mismatch)
          const isMe = String(msg.sender_id) === String(currentUserId);
          const content = msg.content || msg.message || msg.text || ""; 
          
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                {renderMessageContent(content)}
                <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.sent_at 
                    ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        {selectedFile && (
          <div className="mb-3 p-2 bg-gray-50 border rounded-lg flex items-center justify-between">
            <span className="truncate text-sm text-gray-600">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)}><X className="w-4 h-4" /></button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isUploading ? "Uploading..." : "Type your message..."}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            disabled={isUploading}
          />
          <button 
            type="submit" 
            disabled={isUploading || (!newMessage.trim() && !selectedFile)} 
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md disabled:bg-gray-300 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageWindow;