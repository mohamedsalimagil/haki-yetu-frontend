import React from 'react';
import Footer from '../../components/layout/Footer';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">
            <div className="bg-[#1E40AF] text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl text-blue-100">Last updated: January 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-16 px-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12 transition-colors">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-[#1E40AF]" />
                            1. Introduction
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Haki Yetu ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our legal services platform.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We respect your privacy and process your personal data in accordance with the Data Protection Act, 2019 of Kenya and other applicable laws.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="h-6 w-6 text-[#1E40AF]" />
                            2. Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">We collect information that you submit to us voluntarily:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and ID/Passport number.</li>
                            <li><strong>Legal Information:</strong> Documents, case details, and other information related to legal services you request.</li>
                            <li><strong>Payment Information:</strong> M-Pesa transaction details and billing addresses.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our platform, including IP address and browser type.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Server className="h-6 w-6 text-[#1E40AF]" />
                            3. How We Use Your Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">We use your information for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>To provide and manage our legal services and advocate matching.</li>
                            <li>To verify your identity as required by Know Your Customer (KYC) regulations.</li>
                            <li>To process payments and transactions securely.</li>
                            <li>To communicate with you regarding your account, updates, and service requests.</li>
                            <li>To improve our platform functionality and user experience.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Lock className="h-6 w-6 text-[#1E40AF]" />
                            4. Data Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We seek to use reasonable organizational, technical, and administrative measures to protect personal information within our organization. Unfortunately, no data transmission or storage system can be guaranteed to be 100% secure.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Sharing Your Information</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li><strong>Advocates:</strong> To facilitate the legal services you request.</li>
                            <li><strong>Service Providers:</strong> Third-party vendors who perform services for us (e.g., payment processing via M-Pesa).</li>
                            <li><strong>Legal Obligations:</strong> Compliance with laws or legal processes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            If you have questions or comments about this policy, please contact us at privacy@hakiyetu.co.ke.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
