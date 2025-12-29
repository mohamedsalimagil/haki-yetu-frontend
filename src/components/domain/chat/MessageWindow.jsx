import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Paperclip, FileText, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chat.service';

const MessageWindow = ({ activeContact, socket, messages, onSendMessage, currentUserId, onRefreshMessages, socketConnected, mobileView, onBackToContacts }) => {
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
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    setIsActuallyConnected(socket.connected);
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
    setIsUploading(true);

    try {
      // 1. Upload File
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('receiver_id', String(activeContact.id));
          await chatService.uploadFile(formData);
          if (onRefreshMessages) onRefreshMessages();
        } catch (error) {
          alert("Failed to upload file.");
          setIsUploading(false);
          return;
        }
      }

      // 2. Send Text
      if (newMessage.trim()) {
        const textToSend = newMessage.trim();
        
        // FIX: Only pass the STRING to the parent.
        // The parent (ChatPage) handles the socket.emit and state update.
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
    const text = String(input); // Safety cast

    if (text.startsWith('FILE:')) {
      const filename = text.replace('FILE:', '');
      const isImage = filename.match(/\.(jpeg|jpg|gif|png|webp)$/i);
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
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Mobile Header */}
      {mobileView && (
        <div className="bg-white p-3 border-b flex items-center shadow-sm">
           <button onClick={onBackToContacts} className="mr-3 text-blue-600 font-bold text-sm">Back</button>
           <span className="font-bold text-gray-800">{activeContact.first_name}</span>
        </div>
      )}

      {/* Desktop Header */}
      {!mobileView && (
        <div className="bg-white p-4 border-b flex items-center shadow-sm">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500">
            {activeContact.avatar ? (
              <img src={activeContact.avatar} alt={activeContact.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{activeContact.first_name} {activeContact.last_name}</h2>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUserId;
          // Handle potential missing content gracefully
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
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        {selectedFile && (
          <div className="mb-3 p-2 bg-gray-50 border rounded-lg flex items-center justify-between">
            <span className="truncate text-sm text-gray-600">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)}><X className="w-4 h-4" /></button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:bg-gray-50 rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isUploading ? "Uploading..." : "Type your message..."}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" disabled={isUploading} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageWindow;