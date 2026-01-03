import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../services/socket.service';

/**
 * Chat persistence hook - restores conversation history on page refresh
 * Implements the specification from AUTH_HARDENING_GUIDE.md
 */
export function useChatPersistence() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') || searchParams.get('consultation');
  
  const [chatState, setChatState] = useState({
    conversation: null,
    messages: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!caseId) {
      setChatState(prev => ({ ...prev, loading: false }));
      return;
    }

    const restoreChat = async () => {
      try {
        // Step 1: Try localStorage first (offline support)
        const cached = localStorage.getItem(`conversation_${caseId}`);
        if (cached) {
          const conversation = JSON.parse(cached);
          setChatState(prev => ({ ...prev, conversation }));
        }

        // Step 2: Fetch latest conversation metadata from API
        const { data: conversation } = await api.get(`/chat/conversations/case/${caseId}`);
        
        // Step 3: Validate conversation belongs to current user (backend validates)
        
        // Step 4: Load message history
        const { data: messages } = await api.get(`/chat/conversations/${conversation.id}/messages`);

        // Step 5: Update state
        setChatState({
          conversation,
          messages: messages || [],
          loading: false,
          error: null
        });

        // Step 6: Cache for offline
        localStorage.setItem(`conversation_${caseId}`, JSON.stringify(conversation));

        // Step 7: Join socket room
        if (socket && socket.emit) {
          socket.emit('join_conversation', {
            conversation_id: conversation.id,
            case_id: caseId
          });
        }

        // Step 8: Mark messages as read
        await api.post(`/chat/conversations/${conversation.id}/mark_read`).catch(() => {});

      } catch (error) {
        console.error('Chat restoration error:', error);
        setChatState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to restore chat'
        }));
      }
    };

    restoreChat();

    // Cleanup: leave conversation on unmount
    return () => {
      if (socket && socket.emit && caseId) {
        socket.emit('leave_conversation', { case_id: caseId });
      }
    };
  }, [caseId]);

  return chatState;
}

export default useChatPersistence;
