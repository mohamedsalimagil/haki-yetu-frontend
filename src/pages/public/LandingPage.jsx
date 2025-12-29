import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect admin users to admin dashboard
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Legal Services, Simplified.
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Connect with verified lawyers and notarize documents from the comfort of your home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/services" 
            className="bg-secondary px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition inline-flex items-center justify-center"
          >
            Explore Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            to="/register" 
            className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
          >
            Join as Lawyer
          </Link>
        </div>

        {/* User Status Info */}
        {user && user.role === 'client' && (
          <div className="mt-8 inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
            <span className="text-gray-200">Logged in as: <span className="font-semibold">{user.name}</span></span>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FileText className="h-12 w-12 text-primary" />}
          title="Instant Notarization"
          desc="Upload your documents and get them stamped within minutes."
        />
        <FeatureCard
          icon={<UserCheck className="h-12 w-12 text-primary" />}
          title="Verified Lawyers"
          desc="All professionals are vetted against the LSK database."
        />
        <FeatureCard
          icon={<ShieldCheck className="h-12 w-12 text-primary" />}
          title="Secure Payments"
          desc="Powered by M-Pesa. Your money is held in escrow until the job is done."
        />
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard
              number="1"
              title="Choose Service"
              desc="Browse our catalog of legal services"
            />
            <StepCard
              number="2"
              title="Select Lawyer"
              desc="Pick from verified legal professionals"
            />
            <StepCard
              number="3"
              title="Book Appointment"
              desc="Schedule your consultation"
            />
            <StepCard
              number="4"
              title="Secure Payment"
              desc="Pay via M-Pesa safely"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Legal Needs?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Join thousands of Kenyans who trust Haki Yetu for their legal services.
          </p>
          
          {user ? (
            <Link
              to="/services"
              className="inline-block bg-secondary px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Browse Services →
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-secondary px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Login to Get Started
              </Link>
              <Link
                to="/register"
                className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section (Optional) */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <FAQItem
            question="Is my payment secure?"
            answer="Yes, all payments are processed through M-Pesa and held in escrow until the service is completed."
          />
          <FAQItem
            question="How long does it take?"
            answer="Most services are completed within 1-7 days depending on the service type."
          />
          <FAQItem
            question="Are the lawyers verified?"
            answer="Yes, all lawyers are verified against the Law Society of Kenya (LSK) database."
          />
          <FAQItem
            question="What if I'm not satisfied?"
            answer="We have a dispute resolution process to ensure your satisfaction or full refund."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-6 border-t border-blue-700">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Haki Yetu</h3>
            <p className="text-gray-300">
              Making legal services accessible to everyone in Kenya.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/lawyers" className="hover:text-white transition">Lawyers</Link></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-blue-700 text-center text-gray-300">
          <p>&copy; 2025 Haki Yetu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition group cursor-pointer">
    <div className="flex justify-center mb-4 group-hover:scale-110 transition transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition">
      {title}
    </h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, desc }) => (
  <div className="relative">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-sm text-center">{desc}</p>
    </div>
    
    {/* Arrow between steps (hidden on last) */}
    {number !== '4' && (
      <div className="hidden md:block absolute top-6 -right-8 text-primary">
        <ArrowRight className="h-6 w-6" />
      </div>
    )}
  </div>
);

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
      >
        <h3 className="font-semibold text-gray-900">{question}</h3>
        <span className={`text-primary transition transform ${open ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>
      
      {open && (
        <div className="px-6 pb-6 text-gray-600 border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
};

export default LandingPage;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShieldCheck, FileText, UserCheck } from 'lucide-react';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-primary text-white py-20 px-6 text-center">
//         <h1 className="text-4xl md:text-6xl font-bold mb-4">Legal Services, Simplified.</h1>
//         <p className="text-xl md:text-2xl mb-8 text-gray-200">
//           Connect with verified lawyers and notarize documents from the comfort of your home.
//         </p>
//         <div className="space-x-4">
//           <Link to="/services" className="bg-secondary px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
//             Explore Services
//           </Link>
//           <Link to="/register" className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition">
//             Join as Lawyer
//           </Link>
//         </div>
//       </div>

//       {/* Features Grid */}
//       <div className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
//         <FeatureCard 
//           icon={<FileText className="h-12 w-12 text-primary" />} 
//           title="Instant Notarization" 
//           desc="Upload your documents and get them stamped within minutes." 
//         />
//         <FeatureCard 
//           icon={<UserCheck className="h-12 w-12 text-primary" />} 
//           title="Verified Lawyers" 
//           desc="All professionals are vetted against the LSK database." 
//         />
//         <FeatureCard 
//           icon={<ShieldCheck className="h-12 w-12 text-primary" />} 
//           title="Secure Payments" 
//           desc="Powered by M-Pesa. Your money is held in escrow until the job is done." 
//         />
//       </div>
//     </div>
//   );
// };

// // Simple internal component
// const FeatureCard = ({ icon, title, desc }) => (
//   <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
//     <div className="flex justify-center mb-4">{icon}</div>
//     <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
//     <p className="text-gray-600">{desc}</p>
//   </div>
// );

// export default LandingPage;