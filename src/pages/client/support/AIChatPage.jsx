import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader, Phone } from 'lucide-react';
import BackButton from '../../../components/common/BackButton';
import { useAuth } from '../../../context/AuthContext';

const AIChatPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: `Hello ${user?.first_name || 'there'}! I'm your Haki Yetu AI assistant. How can I help you today?`,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const suggestedQuestions = [
        'How do I book a consultation?',
        'What services do you offer?',
        'How do I file a dispute?',
        'How can I get my documents notarized?'
    ];

    const getAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('book') || lowerMessage.includes('consultation') || lowerMessage.includes('appointment')) {
            return "To book a consultation: \ n\ n1.Go to the Advocates page\ n2.Browse and select a lawyer that matches your needs\ n3.Choose an available time slot\ n4.Complete payment via M-Pesa\ n5.You'll receive a confirmation email\n\nWould you like me to direct you to our Advocates directory?";
        }

        if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
            return "Haki Yetu offers several legal services:\n\n• Legal Consultations with verified advocates\n• Document Notarization\n• Dispute Resolution\n• AI Document Summarization\n• Legal Document Generation\n\nWhich service would you like to know more about?";
        }

        if (lowerMessage.includes('dispute') || lowerMessage.includes('complaint')) {
            return "To file a dispute:\n\n1. Go to Support → File a Dispute\n2. Select the order or service\n3. Describe your issue\n4. Upload supporting evidence (if any)\n5. Submit for review\n\nOur team will review and respond within 24-48 hours. Would you like help filing a dispute now?";
        }

        if (lowerMessage.includes('notari')) {
            return "For document notarization:\n\n1. Upload your document\n2. Select notarization service\n3. Complete payment\n4. A verified lawyer will review and notarize\n5. Receive notarized document within 24-48 hours\n\nThe cost is typically KES 500-1500 depending on document type. Would you like to start the notarization process?";
        }

        if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('mpesa')) {
            return "We accept M-Pesa for all payments:\n\n1. Enter your M-Pesa phone number\n2. Confirm the amount\n3. Check your phone for STK push\n4. Enter your M-Pesa PIN\n5. Payment confirmed!\n\nPayments are secure and instant. Do you have questions about a specific payment?";
        }

        if (lowerMessage.includes('refund') || lowerMessage.includes('cancel')) {
            return "For refunds or cancellations:\n\n• Consultations can be rescheduled up to 24 hours before\n• Refunds are processed through dispute resolution\n• Typical refund timeline is 7-14 business days\n\nIf you need a refund, please file a dispute and our team will review your case. Would you like help with this?";
        }

        if (lowerMessage.includes('human') || lowerMessage.includes('agent') || lowerMessage.includes('person') || lowerMessage.includes('talk to someone')) {
            return "I'd be happy to connect you with a human agent! However, I'm here to help answer most questions. Would you still like to speak with a human agent?\n\n💡 Tip: Human agents are available Monday-Friday, 8AM-6PM EAT.";
        }

        // Default response
        return "I'm here to help! I can assist you with:\n\n• Booking consultations\n• Understanding our services\n• Filing disputes\n• Payment questions\n• Document notarization\n\nYou can also request to speak with a human agent anytime. How can I help you today?";
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI typing delay
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                sender: 'ai',
                text: getAIResponse(inputText),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const handleSuggestion = (question) => {
        setInputText(question);
    };

    const handleRequestHuman = () => {
        const humanRequestMessage = {
            id: messages.length + 1,
            sender: 'ai',
            text: "I've notified our support team. A human agent will join this chat shortly. Average wait time is 3-5 minutes during business hours (Mon-Fri, 8AM-6PM EAT).\n\n📞 For urgent matters, you can also call us at: +254 700 000 000",
            timestamp: new Date(),
            isSystemMessage: true
        };
        setMessages([...messages, humanRequestMessage]);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <BackButton to="/client/support" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRequestHuman}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        <Phone className="w-4 h-4" />
                        Request Human Agent
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'ai' ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}>
                                    {message.sender === 'ai' ? (
                                        <Bot className="w-5 h-5 text-white" />
                                    ) : (
                                        <User className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.isSystemMessage
                                            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-gray-900 dark:text-white'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                    </div>
                                    <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
                <div className="px-6 pb-4">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestion(question)}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatPage;
