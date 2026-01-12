import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientFaqs = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { question: "How do I verify a lawyer?", answer: "Go to the 'Advocates' tab and look for the blue 'LSK Verified' badge next to their profile." },
        { question: "Is my payment secure?", answer: "Yes, all payments are held in escrow via M-Pesa and only released when the service is completed." },
        { question: "How do I download my receipt?", answer: "Go to 'Orders' or 'Consultation History', select the transaction, and click 'Download Receipt'." },
        { question: "Can I cancel a booking?", answer: "Yes, you can cancel up to 24 hours before the session for a full refund." },
        { question: "How do I upload documents?", answer: "Navigate to 'My Documents' from your dashboard, click 'Upload Document', and select the file from your device." },
        { question: "What is the dispute resolution process?", answer: "If you experience issues with a service, go to Support > Initiate Dispute, select the transaction, and our team will mediate within 48 hours." },
        { question: "How do I change my profile information?", answer: "Click on your profile icon in the top right, select 'Profile Settings', and update your information there." },
        { question: "What types of legal services are available?", answer: "We offer consultations, document review, legal representation, notarization, and contract drafting across various legal fields." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-400 mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Support
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Find answers to common questions about using Haki Yetu</p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <span>{faq.question}</span>
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openIndex === index && (
                                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Still have questions? <button onClick={() => navigate('/client/support/chat')} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Chat with our AI assistant</button> or contact support directly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientFaqs;
