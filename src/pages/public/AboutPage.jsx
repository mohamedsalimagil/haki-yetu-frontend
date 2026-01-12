import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Lock, CheckCircle, Award, Heart, Target, Scale } from 'lucide-react';
import Footer from '../../components/layout/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">


      {/* Hero Section */}
      <section className="bg-[#1E40AF] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Democratizing Legal Access in Kenya
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            We're revolutionizing legal services in Kenya by making professional legal advice accessible, affordable, and secure for every citizen through innovative technology and trusted partnerships.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-[#1E40AF] mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Bridging the Justice Gap Through Technology
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                In Kenya, millions of citizens lack access to affordable legal services due to geographic barriers, high costs, and complex legal processes. Haki Yetu was founded to change this reality.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We combine cutting-edge technology with deep legal expertise to provide secure, affordable, and professional legal services that anyone can access from their smartphone or computer.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our platform connects verified lawyers with clients through a secure digital ecosystem, ensuring that justice is not a privilege but a right accessible to all Kenyans.
              </p>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-700 p-8 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Our Vision</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To create a Kenya where every citizen has equal access to justice, where technology removes barriers, and where legal services are transparent, affordable, and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 px-6 bg-[#F9FAFB] dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do and ensure we deliver on our promise of accessible justice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Scale className="h-8 w-8" />}
              title="Transparency"
              description="Clear pricing with no hidden fees. M-Pesa and card payments are clearly displayed upfront."
              detail="Every service cost is transparent - no surprise charges, no hidden fees, no complex billing."
            />
            <ValueCard
              icon={<Lock className="h-8 w-8" />}
              title="Security"
              description="256-bit Bank Grade SSL Encryption protects all your data and communications."
              detail="Your information is secured with enterprise-grade encryption, compliant with international security standards."
            />
            <ValueCard
              icon={<Award className="h-8 w-8" />}
              title="Trust"
              description="All advocates are verified LSK members with proven track records."
              detail="Every lawyer on our platform is accredited by the Law Society of Kenya and undergoes rigorous background checks."
            />
          </div>
        </div>
      </section>

      {/* Legal Compliance Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Legal Compliance & Security
            </h2>
            <div className="w-24 h-1 bg-[#1E40AF] mx-auto mb-8"></div>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-gray-700 p-8 rounded-lg border border-gray-200 dark:border-gray-600 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Shield className="h-8 w-8 text-[#1E40AF]" />
              Advocates Act Compliance
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Haki Yetu operates in full compliance with the Advocates Act of Kenya and all relevant regulations. Our platform maintains the highest standards of legal practice while making services more accessible.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">LSK Accreditation Required</h4>
                  <p className="text-gray-600 dark:text-gray-300">All lawyers must provide valid Law Society of Kenya membership numbers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Indemnity</h4>
                  <p className="text-gray-600 dark:text-gray-300">Lawyers maintain professional indemnity insurance as required by law.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Code of Conduct</h4>
                  <p className="text-gray-600 dark:text-gray-300">All advocates adhere to the LSK Code of Conduct and Ethics.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Continuing Education</h4>
                  <p className="text-gray-600 dark:text-gray-300">Lawyers maintain required continuing legal education credits.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1E40AF] to-blue-700 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Why We Require KYC Verification</h3>
            <p className="text-lg mb-6 leading-relaxed">
              Know Your Customer (KYC) verification is essential for maintaining the integrity of our legal platform and protecting all users. This process ensures:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Legal Compliance</h4>
                <p className="text-sm text-blue-100">Meeting regulatory requirements for legal service provision.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Fraud Prevention</h4>
                <p className="text-sm text-blue-100">Protecting against fraudulent activities and identity theft.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Quality Assurance</h4>
                <p className="text-sm text-blue-100">Ensuring only legitimate clients access legal services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6 bg-[#1E40AF] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Impact in Kenya
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Real numbers that demonstrate our commitment to democratizing legal access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              number="2,000+"
              label="Kenyans Served"
              icon={<Users className="h-8 w-8" />}
            />
            <StatCard
              number="150+"
              label="Verified Advocates"
              icon={<Award className="h-8 w-8" />}
            />
            <StatCard
              number="10,000+"
              label="Documents Processed"
              icon={<CheckCircle className="h-8 w-8" />}
            />
            <StatCard
              number="98%"
              label="Client Satisfaction"
              icon={<Heart className="h-8 w-8" />}
            />
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Help us expand access to justice across Kenya. Whether you're a lawyer wanting to serve more clients or a citizen seeking legal help, Haki Yetu is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
              >
                Join Our Community
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
              >
                Find Legal Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Value Card Component
const ValueCard = ({ icon, title, description, detail }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-center w-16 h-16 bg-[#1E40AF] text-white rounded-lg mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-center leading-relaxed">{description}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">{detail}</p>
  </div>
);

// Stat Card Component
const StatCard = ({ number, label, icon }) => (
  <div className="text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-4 mx-auto">
      {icon}
    </div>
    <div className="text-4xl font-bold mb-2">{number}</div>
    <div className="text-blue-100">{label}</div>
  </div>
);

export default AboutPage;

