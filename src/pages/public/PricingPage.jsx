import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Users, FileText, Phone, Award, Zap } from 'lucide-react';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: 'Individual',
      description: 'Perfect for personal legal needs',
      monthlyPrice: 999,
      annualPrice: 9990,
      popular: false,
      features: [
        'Document Generation',
        'Legal Consultation (2 hours)',
        'Notarization Services',
        'Basic Contract Review',
        'Email Support',
        'Mobile App Access'
      ],
      cta: 'Start Free Trial',
      ctaLink: '/register'
    },
    {
      name: 'Professional',
      description: 'Ideal for small businesses and entrepreneurs',
      monthlyPrice: 2499,
      annualPrice: 24990,
      popular: true,
      features: [
        'Everything in Individual',
        'Unlimited Consultations',
        'Advanced Contract Drafting',
        'Business Formation',
        'Priority Support',
        'Multi-user Access (3 users)',
        'Legal Document Storage'
      ],
      cta: 'Start Professional Plan',
      ctaLink: '/register'
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive legal support for growing businesses',
      monthlyPrice: 4999,
      annualPrice: 49990,
      popular: false,
      features: [
        'Everything in Professional',
        'Dedicated Legal Advisor',
        'Custom Legal Templates',
        'Compliance Monitoring',
        'Priority Case Handling',
        'Unlimited Users',
        'API Access',
        'Custom Integrations'
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact'
    }
  ];

  const addons = [
    {
      name: 'Legal Research Package',
      description: 'Advanced legal research and case law analysis',
      price: 'KES 5,000/month',
      icon: <FileText className="h-6 w-6" />
    },
    {
      name: 'Priority Support',
      description: '24/7 priority customer support',
      price: 'KES 2,500/month',
      icon: <Phone className="h-6 w-6" />
    },
    {
      name: 'Additional Users',
      description: 'Add team members to your account',
      price: 'KES 1,500/user/month',
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#1E40AF]">
                Haki Yetu
              </Link>
            </div>

            {/* Navigation - Center */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Services</Link>
              <Link to="/advocates" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Advocates</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Pricing</Link>
            </nav>

            {/* Actions - Right */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing for<br />
            <span className="text-[#1E40AF]">Accessible Justice</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your legal needs. No hidden fees, no surprise charges - just transparent pricing you can trust.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                billingPeriod === 'monthly'
                  ? 'bg-[#1E40AF] text-white'
                  : 'text-gray-700 hover:text-[#1E40AF]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition relative ${
                billingPeriod === 'annual'
                  ? 'bg-[#1E40AF] text-white'
                  : 'text-gray-700 hover:text-[#1E40AF]'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-[#FACC15] text-[#1E40AF] text-xs px-2 py-1 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlan(plan.name)}
                className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  selectedPlan === plan.name
                    ? 'border-[#1E40AF] ring-4 ring-[#1E40AF]/20 transform scale-105'
                    : plan.popular
                    ? 'border-[#1E40AF] transform scale-105'
                    : 'border-gray-200 hover:border-[#1E40AF]/50'
                }`}
              >
                {selectedPlan === plan.name && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                {plan.popular && (
                  <div className="bg-[#1E40AF] text-white text-center py-2 rounded-t-lg">
                    <span className="font-bold text-sm flex items-center justify-center gap-1">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        KES {(billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12)).toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2">/{billingPeriod === 'monthly' ? 'month' : 'month'}</span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Save KES {(plan.monthlyPrice * 12 - plan.annualPrice).toLocaleString()} annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.ctaLink}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-center block transition ${
                      plan.popular
                        ? 'bg-[#1E40AF] text-white hover:bg-blue-800'
                        : 'bg-[#1E40AF] text-white hover:bg-blue-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enhance Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Add specialized services to meet your specific legal requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {addons.map((addon, index) => (
              <div key={index} className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200 hover:border-[#1E40AF] transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#1E40AF] text-white rounded-lg">
                    {addon.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{addon.name}</h3>
                    <p className="text-sm text-gray-600">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1E40AF]">{addon.price}</span>
                  <button className="text-[#1E40AF] font-medium hover:underline">
                    Add to Plan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Haki Yetu?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our comprehensive legal platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">LSK Verified</h3>
              <p className="text-gray-600 text-sm">All advocates are registered with the Law Society of Kenya</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600 text-sm">Most documents processed within 24-48 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">Rigorous quality checks on all legal documents</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">Dedicated support team available 6 days a week</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and services.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>

            <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept M-Pesa, card payments, and bank transfers. All payments are processed securely.</p>
            </div>

            <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Start with our 14-day free trial to explore all features before committing.</p>
            </div>

            <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee if you're not satisfied with our services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E40AF] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans who trust Haki Yetu for their legal needs. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-[#FACC15]" />
                <span className="text-2xl font-bold">Haki Yetu</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Making legal services accessible and affordable for every Kenyan.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Shield className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Award className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link to="/advocates" className="hover:text-white transition">Find an Advocate</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white transition">For Lawyers</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Haki Yetu. All rights reserved. Made with ❤️ for Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
