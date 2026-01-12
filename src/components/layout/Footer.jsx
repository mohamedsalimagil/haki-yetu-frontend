import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 px-6 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                    {/* Company Info */}
                    <div>
                        <span className="text-xl font-bold">Haki Yetu</span>
                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                            Digital justice for Kenya.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold mb-3">Platform</h4>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                            <li><Link to="/advocates" className="hover:text-white transition">Find Advocate</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <div className="flex flex-col items-center gap-3">
                        {/* Gradient Divider */}
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-2"></div>

                        <p className="text-gray-400 text-sm">
                            © 2026 <span className="text-white font-semibold">Haki Yetu</span>. All rights reserved.
                        </p>

                        <p className="text-sm flex items-center gap-1 text-gray-400">
                            Made with{' '}
                            <span className="text-red-500 animate-pulse text-lg">❤️</span>
                            {' '}by{' '}
                            <span className="flex items-center gap-2 ml-1">
                                <a
                                    href="https://github.com/mohamedsalimagil"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition"
                                >
                                    Mohamed
                                </a>
                                <span className="text-gray-600">•</span>
                                <a
                                    href="https://github.com/BeatriceWN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition"
                                >
                                    Beatrice
                                </a>
                                <span className="text-gray-600">•</span>
                                <a
                                    href="https://github.com/mikendirangu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-400 hover:text-pink-300 font-medium hover:underline transition"
                                >
                                    Michael
                                </a>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

