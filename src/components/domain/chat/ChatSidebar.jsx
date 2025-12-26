import React, { useState, useEffect } from 'react';
import chatService from '../../../services/chat.service'; // ✅ Import ChatService
import { useAuth } from '../../../context/AuthContext';

const ChatSidebar = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // ✅ CORRECT CALL: Fetch Contacts, not Bookings!
      const response = await chatService.getContacts();

      // Handle the wrapper { contacts: [...] }
      if (response.data && response.data.contacts) {
        setContacts(response.data.contacts);
      } else if (Array.isArray(response.data)) {
        setContacts(response.data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError('Could not load contacts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading contacts...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-1/3 border-r h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full p-2 border rounded bg-gray-50"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No conversations yet.
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {contact.first_name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {contact.first_name} {contact.last_name}
                </h3>
                <p className="text-sm text-gray-500">Click to chat</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
