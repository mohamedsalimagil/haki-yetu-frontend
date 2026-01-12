import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, CheckCircle, Loader, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../../components/common/LoadingScreen';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // For full-screen loading during redirect
  const [notification, setNotification] = useState(null); // Add state for custom notification

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null); // Clear previous messages
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      // Show loading screen during redirect
      setIsRedirecting(true);

      // Small delay for smooth transition
      setTimeout(() => {
        // Navigation logic for ACTIVE users only
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'lawyer') navigate('/lawyer/dashboard');
        else {
          // Client logic
          if (user.verification_status === 'verified') {
            navigate('/client/dashboard');
          } else {
            navigate('/client/verification-pending');
          }
        }
      }, 1000); // 1 second delay for loading animation

    } catch (err) {
      // --- NEW LOGIC: HANDLE PENDING POPUP ---
      if (err.response?.data?.error === "ACCOUNT_PENDING") {
        // Show the "Pop-up" / Notification
        setNotification({
          type: 'info',
          title: 'Verification in Progress',
          message: 'To ensure the integrity of legal services on Haki Yetu, we are manually verifying your identity. Estimated time: 2-24 Hours.'
        });
      } else {
        // Handle standard invalid password/email errors
        toast.error(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed grid-cols-2 to grid-cols-4 for a 25/75 split
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 bg-white dark:bg-gray-900 font-sans transition-colors relative">

      {/* Loading Overlay - shown within the page during redirect */}
      {isRedirecting && <LoadingScreen message="Signing you in" overlay={true} />}

      {/* --- LEFT COLUMN: BRANDING (Now takes 1/4 of width) --- */}
      <div className="hidden lg:relative lg:flex lg:col-span-1 flex-col justify-between bg-slate-900 text-white p-8 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/kenya_flag_flowing.png"
            alt="Kenya Flag"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg mt-8">
            Justice for All.
            <span className="block text-blue-400 mt-2">Empowered by Tech.</span>
          </h1>
          <p className="text-base text-slate-100 leading-relaxed font-medium drop-shadow">
            Access expert legal counsel, manage your documents, and assert your rights with confidence.
          </p>
        </div>

        {/* Security Badges */}
        <div className="relative z-10 mt-12 flex flex-col gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: FORM (Now takes 3/4 of width) --- */}
      <div className="lg:col-span-3 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md space-y-8">

          {/* --- NOTIFICATION POP-UP --- */}
          {notification && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm relative">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {/* Info Icon */}
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">{notification.title}</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>{notification.message}</p>
                  </div>
                </div>
                {/* Close Button */}
                <button onClick={() => setNotification(null)} className="absolute top-2 right-2 text-blue-400 hover:text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              New to Haki Yetu? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">Create an account</Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="animate-spin w-5 h-5" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
