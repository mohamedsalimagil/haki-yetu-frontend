import React from 'react';
import Footer from '../../components/layout/Footer';
import { FileText, AlertCircle, Gavel, Scale } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">
            <div className="bg-[#1E40AF] text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-xl text-blue-100">Effective Date: January 1, 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-16 px-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12 transition-colors">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-[#1E40AF]" />
                            1. Agreement to Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Haki Yetu ("we," "us," or "our"), concerning your access to and use of the Haki Yetu website and application.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Scale className="h-6 w-6 text-[#1E40AF]" />
                            2. Legal Advice Disclaimer
                        </h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-[#FACC15] p-4 mb-4 transition-colors">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                IMPORTANT: Haki Yetu is a platform that connects clients with independent advocates. We are not a law firm and do not provide legal advice.
                            </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            The content on our platform is for informational purposes only. No attorney-client relationship is formed between you and Haki Yetu. An attorney-client relationship may be formed between you and an advocate you connect with through our services, subject to the advocate's terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Gavel className="h-6 w-6 text-[#1E40AF]" />
                            3. User Responsibilities
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">By using our platform, you represent and warrant that:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            <li>You agree to pay all fees associated with the services you purchase.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Payment and Refunds</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            <strong>Fees:</strong> Fees for services are displayed before purchase. Payments are processed securely via M-Pesa or other integrated payment gateways.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            <strong>Refunds:</strong> We offer a dispute resolution process. If you are dissatisfied with a service, you may initiate a dispute within 7 days of service completion. Refunds are granted at our sole discretion based on the outcome of the dispute resolution.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-[#1E40AF]" />
                            5. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            In no event will we be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the site or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Governing Law</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            These Terms shall be governed by and defined following the laws of Kenya. Haki Yetu and yourself irrevocably consent that the courts of Kenya shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfService;
