import React from 'react';
import Footer from '../../components/layout/Footer';
import { Cookie, Info, Settings, ShieldCheck } from 'lucide-react';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">
            <div className="bg-[#1E40AF] text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                    <p className="text-xl text-blue-100">Last updated: January 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-16 px-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12 transition-colors">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Cookie className="h-6 w-6 text-[#1E40AF]" />
                            1. What Are Cookies?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Info className="h-6 w-6 text-[#1E40AF]" />
                            2. How We Use Cookies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">We use cookies for the following purposes:</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900 dark:text-white block">Essential Cookies</strong>
                                    <span className="text-gray-600 dark:text-gray-300">Necessary for the website to function properly. This includes cookies that allow you to log in to secure areas of our platform.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Settings className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900 dark:text-white block">Functionality Cookies</strong>
                                    <span className="text-gray-600 dark:text-gray-300">Used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900 dark:text-white block">Analytical/Performance Cookies</strong>
                                    <span className="text-gray-600 dark:text-gray-300">Allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</span>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Third-Party Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on (e.g., Google Analytics).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Managing Your Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Contact</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            For any queries regarding our use of cookies, please contact support@hakiyetu.co.ke.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
