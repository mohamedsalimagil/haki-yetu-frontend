import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../../components/domain/chat/ChatWindow';

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <ChatWindow orderId={orderId} userId={user?.id} />
    </div>
  );
};

export default ChatPage;
