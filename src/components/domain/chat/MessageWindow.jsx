import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Paperclip, FileText, Image as ImageIcon, X } from 'lucide-react';
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

    // Initial check
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
      // Basic validation (optional)
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size too large (Max 5MB)");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle Send (Text + Optional File)
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || isUploading) return;

    setIsUploading(true);

    try {
      // 1. Upload File if selected (backend creates the FILE: message)
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile); // ✅ Ensure the key matches backend expectation
          formData.append('receiver_id', String(activeContact.id)); // Ensure string for backend int() conversion

          await chatService.uploadFile(formData);

          // Refresh messages to show the new FILE: message from backend
          if (onRefreshMessages) {
            onRefreshMessages();
          }
        } catch (error) {
          console.error("Upload failed", error);
          alert("Failed to upload file. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      // 2. Send Text Message if present
      if (newMessage.trim()) {
        const messageContent = newMessage.trim();

        // Only send text messages when socket is connected
        if (socket && socket.connected) {
          const payload = {
            recipient_id: activeContact.id,
            content: messageContent
          };
          socket.emit('send_message', payload);

          // Optimistic UI update (optional, but good for UX)
          onSendMessage({
            sender_id: currentUserId,
            content: messageContent,
            created_at: new Date().toISOString()
          });
        } else {
          // Don't send when offline, just show warning
          console.warn("Cannot send text message when offline");
          alert("Cannot send messages when offline. Please wait for connection to be restored.");
          setIsUploading(false);
          return;
        }
      }

      // 3. Reset State
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Send failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to render message content (Text vs Image vs File)
  const renderMessageContent = (text) => {
    if (!text) return null;

    // Check for File Marker (new format from backend)
    if (text.startsWith('FILE:')) {
      const filename = text.replace('FILE:', '');
      const isImage = filename.match(/\.(jpeg|jpg|gif|png|webp)$/i);

      if (isImage) {
        return (
          <div className="mt-2">
            <img
              src={`http://127.0.0.1:5000/chat/uploads/${filename}`}
              alt="Attachment"
              className="max-w-full sm:max-w-[250px] rounded-lg border border-white/20"
              loading="lazy"
            />
          </div>
        );
      } else {
        // For non-image files, show download link
        return (
          <a
            href={`http://127.0.0.1:5000/chat/uploads/${filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 mt-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
          >
            <div className="p-2 bg-white rounded-full text-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate max-w-[150px]">{filename}</span>
              <span className="text-xs opacity-70">Click to download</span>
            </div>
          </a>
        );
      }
    }

    // Check for old Attachment Marker (backward compatibility)
    if (text.includes('[ATTACHMENT]:')) {
      const parts = text.split('[ATTACHMENT]: ');
      const msgText = parts[0];
      const url = parts[1];

      // Determine if image based on extension (simple check)
      const isImage = url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

      return (
        <div className="flex flex-col gap-2">
          {msgText && <p className="whitespace-pre-wrap break-words">{msgText}</p>}

          {isImage ? (
            <div className="mt-2">
              <img
                src={url}
                alt="Attachment"
                className="max-w-full sm:max-w-[250px] rounded-lg border border-white/20"
                loading="lazy"
              />
            </div>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 mt-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              <div className="p-2 bg-white rounded-full text-primary">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate max-w-[150px]">View Document</span>
                <span className="text-xs opacity-70">Click to open</span>
              </div>
            </a>
          )}
        </div>
      );
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
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center shadow-sm">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-500">
          {activeContact.avatar ? (
            <img src={activeContact.avatar} alt={activeContact.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{activeContact.name}</h2>
          <p className="text-xs text-green-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                  isMe
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                {renderMessageContent(msg.content)}
                <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-3 p-2 bg-gray-50 border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
              <Paperclip className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isUploading ? "Uploading..." : "Type your message..."}
            disabled={isUploading}
            className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
          />

          <div className="flex items-center gap-2">
            {!isActuallyConnected && (
              <span className="text-xs text-red-500">Offline</span>
            )}
            <button
              type="submit"
              disabled={(!newMessage.trim() && !selectedFile) || isUploading}
              className="p-3 bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center min-w-[48px]"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageWindow;
