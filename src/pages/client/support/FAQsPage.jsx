import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, Book, HelpCircle } from 'lucide-react';
import BackButton from '../../../components/common/BackButton';

const FAQsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const faqs = [
        {
            id: 1,
            category: 'Getting Started',
            question: 'How do I create an account?',
            answer: 'To create an account, click on "Get Started" on the homepage, choose your role (Client or Lawyer), and fill in the required information including your email, password, and personal details.'
        },
        {
            id: 2,
            category: 'Getting Started',
            question: 'What services does Haki Yetu offer?',
            answer: 'Haki Yetu offers legal consultations, document notarization, dispute resolution, AI document summarization, and access to verified advocates. We help connect clients with legal professionals for their various legal needs.'
        },
        {
            id: 3,
            category: 'Payments',
            question: 'What payment methods are accepted?',
            answer: 'We accept M-Pesa for all payments. Simply select your service, enter your M-Pesa phone number, and confirm the STK push notification on your phone to complete payment.'
        },
        {
            id: 4,
            category: 'Payments',
            question: 'How do I get a refund?',
            answer: 'If you need a refund, please file a dispute through the Support page. Our team will review your case and process refunds according to our refund policy. Refunds are typically processed within 7-14 business days.'
        },
        {
            id: 5,
            category: 'Consultations',
            question: 'How do I book a consultation?',
            answer: 'Browse our Advocates directory, select a lawyer that matches your needs, choose an available time slot, and complete the payment. You will receive a confirmation email and calendar invite.'
        },
        {
            id: 6,
            category: 'Consultations',
            question: 'Can I reschedule a consultation?',
            answer: 'Yes, you can request to reschedule a consultation up to 24 hours before the scheduled time. Contact the lawyer directly through the messaging system or reach out to support.'
        },
        {
            id: 7,
            category: 'Documents',
            question: 'How does document notarization work?',
            answer: 'Upload your document, select the notarization service, complete payment, and a verified lawyer will review and notarize your document. You will receive the notarized document via email within 24-48 hours.'
        },
        {
            id: 8,
            category: 'Documents',
            question: 'Is my data secure?',
            answer: 'Yes, we use industry-standard encryption and secure servers to protect your data. All documents are encrypted in transit and at rest. We comply with data protection regulations and never share your information without consent.'
        },
        {
            id: 9,
            category: 'Account',
            question: 'How do I verify my account?',
            answer: 'After registration, upload your National ID and other required documents through your profile settings. Our admin team will review and verify your account within 24-48 hours.'
        },
        {
            id: 10,
            category: 'Account',
            question: 'I forgot my password, what do I do?',
            answer: 'Click on "Forgot Password" on the login page, enter your email address, and you will receive a password reset link. Follow the link to create a new password.'
        }
    ];

    const categories = [...new Set(faqs.map(faq => faq.category))];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFaq = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors">
                <div className="max-w-5xl mx-auto">
                    <BackButton to="/client/support" />
                </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 py-16 px-6 transition-colors">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Book className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Find answers to common questions about Haki Yetu
                    </p>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {categories.map((category) => {
                    const categoryFaqs = filteredFaqs.filter(faq => faq.category === category);

                    if (categoryFaqs.length === 0) return null;

                    return (
                        <div key={category} className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{category}</h2>
                            <div className="space-y-4">
                                {categoryFaqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                                            </div>
                                            {expandedId === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        {expandedId === faq.id && (
                                            <div className="px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try searching with different keywords</p>
                    </div>
                )}

                {/* Still need help? */}
                <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Our support team is here to assist you
                    </p>
                    <button
                        onClick={() => navigate('/client/support/chat')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQsPage;
