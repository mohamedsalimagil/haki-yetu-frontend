import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Users, Scale, Home, Briefcase, Gavel, Search, ArrowRight, CheckCircle } from 'lucide-react';
import Footer from '../../components/layout/Footer';

const ServicesPage = () => {
  const categories = [
    {
      title: "Document Services",
      description: "Legal document creation and processing",
      icon: <FileText className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Contract Drafting", price: "From KES 2,500", route: "/services" },
        { name: "Will Writing", price: "From KES 3,000", route: "/services" },
        { name: "Agreement Templates", price: "From KES 1,500", route: "/services" },
        { name: "Legal Letters", price: "From KES 1,000", route: "/services" }
      ]
    },
    {
      title: "Notarization Services",
      description: "Official document authentication",
      icon: <Shield className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Document Notarization", price: "From KES 500", route: "/services/notarization" },
        { name: "Affidavit Preparation", price: "From KES 2,000", route: "/services" },
        { name: "Power of Attorney", price: "From KES 3,500", route: "/services" },
        { name: "Statutory Declaration", price: "From KES 2,500", route: "/services" }
      ]
    },
    {
      title: "Legal Consultation",
      description: "Expert legal advice and guidance",
      icon: <Users className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Initial Consultation", price: "KES 2,000/session", route: "/advocates" },
        { name: "Legal Review", price: "From KES 5,000", route: "/advocates" },
        { name: "Case Assessment", price: "KES 3,000", route: "/advocates" },
        { name: "Document Analysis", price: "From KES 2,500", route: "/advocates" }
      ]
    },
    {
      title: "Property & Land Services",
      description: "Real estate and property law",
      icon: <Home className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Land Search", price: "From KES 1,500", route: "/services" },
        { name: "Title Deed Verification", price: "From KES 2,000", route: "/services" },
        { name: "Property Agreements", price: "From KES 4,000", route: "/services" },
        { name: "Lease Agreements", price: "From KES 3,000", route: "/services" }
      ]
    },
    {
      title: "Business Law",
      description: "Corporate and commercial legal services",
      icon: <Briefcase className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Company Registration", price: "From KES 15,000", route: "/services" },
        { name: "Business Contracts", price: "From KES 5,000", route: "/services" },
        { name: "Partnership Agreements", price: "From KES 4,000", route: "/services" },
        { name: "Employment Contracts", price: "From KES 3,500", route: "/services" }
      ]
    },
    {
      title: "Dispute Resolution",
      description: "Mediation and legal dispute services",
      icon: <Scale className="h-8 w-8 text-[#1E40AF] dark:text-blue-400" />,
      services: [
        { name: "Mediation Services", price: "From KES 10,000", route: "/services" },
        { name: "Arbitration Support", price: "From KES 15,000", route: "/services" },
        { name: "Court Representation", price: "From KES 25,000", route: "/services" },
        { name: "Legal Opinion", price: "From KES 8,000", route: "/services" }
      ]
    }
  ];

  const features = [
    { icon: <CheckCircle className="h-6 w-6 text-green-500" />, text: "Verified LSK Lawyers" },
    { icon: <Shield className="h-6 w-6 text-blue-500" />, text: "Secure Payment Processing" },
    { icon: <Users className="h-6 w-6 text-purple-500" />, text: "24/7 Customer Support" },
    { icon: <FileText className="h-6 w-6 text-orange-500" />, text: "Digital Document Delivery" }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">


      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-20 px-6 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Legal Services Catalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Comprehensive legal services tailored for Kenyan citizens and businesses. All services delivered by verified LSK advocates.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-[#1E40AF] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-white">
                {feature.icon}
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{service.name}</span>
                      <span className="text-[#1E40AF] dark:text-blue-400 font-semibold">{service.price}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={category.services[0].route}
                  className="inline-flex items-center gap-2 bg-[#1E40AF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition w-full justify-center"
                >
                  View All Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E40AF] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Help Choosing a Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our legal experts are here to guide you through the process and recommend the best services for your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/advocates"
              className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
            >
              Speak to an Advocate
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
