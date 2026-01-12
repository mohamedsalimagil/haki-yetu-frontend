import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ChatSidebar from '../../components/domain/chat/ChatSidebar';
import ChatWindow from '../../components/domain/chat/ChatWindow';
import chatService from '../../services/chat.service';

const AdminMessages = () => {
    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get('userId');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const location = useLocation();

    // Handle chat initiation from other pages
    useEffect(() => {
        if (location.state?.initiateChat) {
            const { userId } = location.state.initiateChat;
            const selectExistingOrNew = async () => {
                try {
                    const convs = await chatService.getConversations();
                    const existing = convs.find(c => String(c.participant.id) === String(userId));
                    if (existing) {
                        setSelectedConversation(existing);
                    } else {
                        setSelectedConversation({
                            id: 'new',
                            participant: location.state.initiateChat
                        });
                    }
                } catch (err) {
                    console.error("Failed to initiate chat from state", err);
                }
            };
            selectExistingOrNew();
        }
    }, [location.state]);

    // Track userId from search params for legacy support
    useEffect(() => {
        if (targetUserId) {
            const findAndSelect = async () => {
                try {
                    const convs = await chatService.getConversations();
                    const match = convs.find(c => String(c.participant.id) === String(targetUserId));
                    if (match) {
                        setSelectedConversation(match);
                    } else {
                        // If no conversation exists, we might want to create a temporary one object
                        // to allow ChatWindow to initialize a new chat.
                        // This depends on ChatWindow handling.
                        // For now, we'll leave it unselected if not found.
                        console.log("No existing conversation found for user", targetUserId);

                        // Optional: Mock a conversation object so we can start chatting?
                        // setSelectedConversation({
                        //    id: 'new', 
                        //    participant: { id: targetUserId, name: 'User ' + targetUserId, role: 'user' } 
                        // });
                    }
                } catch (err) {
                    console.error("Failed to auto-select conversation", err);
                }
            };
            findAndSelect();
        }
    }, [targetUserId]);

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm m-6 transition-colors">
            <ChatSidebar
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.id}
            />
            <ChatWindow selectedConversation={selectedConversation} />
        </div>
    );
};

export default AdminMessages;
