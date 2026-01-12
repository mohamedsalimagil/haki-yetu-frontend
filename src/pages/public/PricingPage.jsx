import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Users, FileText, Phone, Award, Zap } from 'lucide-react';
import Footer from '../../components/layout/Footer';

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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">


      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-20 px-6 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Transparent Pricing for<br />
            <span className="text-[#1E40AF] dark:text-blue-400">Accessible Justice</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your legal needs. No hidden fees, no surprise charges - just transparent pricing you can trust.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition ${billingPeriod === 'monthly'
                ? 'bg-[#1E40AF] dark:bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#1E40AF] dark:hover:text-blue-400'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition relative ${billingPeriod === 'annual'
                ? 'bg-[#1E40AF] dark:bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#1E40AF] dark:hover:text-blue-400'
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
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${selectedPlan === plan.name
                  ? 'border-[#1E40AF] dark:border-blue-500 ring-4 ring-[#1E40AF]/20 dark:ring-blue-500/20 transform scale-105'
                  : plan.popular
                    ? 'border-[#1E40AF] dark:border-blue-500 transform scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#1E40AF]/50 dark:hover:border-blue-500/50'
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
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        KES {(billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12)).toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">/{billingPeriod === 'monthly' ? 'month' : 'month'}</span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                        Save KES {(plan.monthlyPrice * 12 - plan.annualPrice).toLocaleString()} annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.ctaLink}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-center block transition ${plan.popular
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
      <section className="py-16 px-6 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enhance Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Add specialized services to meet your specific legal requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {addons.map((addon, index) => (
              <div key={index} className="bg-[#F9FAFB] dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#1E40AF] transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#1E40AF] text-white rounded-lg">
                    {addon.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{addon.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1E40AF] dark:text-blue-400">{addon.price}</span>
                  <button className="text-[#1E40AF] dark:text-blue-400 font-medium hover:underline">
                    Add to Plan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-6 bg-[#F9FAFB] dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Haki Yetu?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our comprehensive legal platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">LSK Verified</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">All advocates are registered with the Law Society of Kenya</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Most documents processed within 24-48 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Quality Assured</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Rigorous quality checks on all legal documents</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E40AF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dedicated support team available 6 days a week</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our pricing and services.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F9FAFB] dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">We accept M-Pesa, card payments, and bank transfers. All payments are processed securely.</p>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes! Start with our 14-day free trial to explore all features before committing.</p>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-300">We offer a 30-day money-back guarantee if you're not satisfied with our services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Compact Uko na Lawyer */}
      <section className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 px-6 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          {/* Graffiti-style Uko na Lawyer */}
          <div className="relative inline-block mb-4">
            {/* Shadow/3D effect layers */}
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight absolute -left-1 top-1 text-black/10 dark:text-white/10"
              style={{
                fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive",
                transform: 'rotate(-2deg)'
              }}
            >
              Uko na Lawyer?
            </h2>
            {/* Main graffiti text */}
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight relative"
              style={{
                fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive",
                background: 'linear-gradient(135deg, #1E40AF 0%, #DC2626 33%, #16A34A 66%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transform: 'rotate(-2deg)'
              }}
            >
              Uko na Lawyer?
            </h2>
            {/* Decorative underline stroke */}
            <svg className="absolute -bottom-1 left-0 w-full h-3" viewBox="0 0 200 12">
              <path
                d="M5 6 Q50 2 100 8 T195 5"
                stroke="url(#pricingUnderlineGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="animate-draw"
              />
              <defs>
                <linearGradient id="pricingUnderlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-base mt-4">
            Get started with trusted legal services today
          </p>
          <Link
            to="/register"
            className="inline-block mt-4 px-8 py-3 bg-[#1E40AF] text-white font-bold rounded-lg hover:bg-blue-800 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PricingPage;
