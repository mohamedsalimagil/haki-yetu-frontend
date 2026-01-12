import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, CheckCircle, User, Briefcase, Loader, Eye, EyeOff, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../../components/common/LoadingScreen';

const Register = () => {
  const [role, setRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // For full-screen loading during redirect

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: ''
  });

  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Password validation rules
  const passwordValidation = useMemo(() => {
    const password = formData.password;
    return {
      hasMinLength: password.length >= 8,
      hasMaxLength: password.length <= 16,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean);
  }, [passwordValidation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password before submitting
    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: role,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        gender: formData.gender
      };

      // 1. REGISTER USER
      console.log('Attempting registration...');
      const regResponse = await register(payload);

      // Stop if registration returned an error or failed
      if (!regResponse || regResponse.success === false) {
        console.error("Registration failed, stopping flow.");
        throw new Error(regResponse?.message || "Registration failed.");
      }

      // 2. AUTO-LOGIN (Only if Step 1 Passed)
      console.log('Registration success. Attempting auto-login...');
      const loginResponse = await login(formData.email, formData.password);

      if (!loginResponse || loginResponse.success === false) {
        console.error("Auto-login failed.");
        toast.success("Account created! Please log in manually.");
        navigate('/login');
        return;
      }

      toast.success(`Welcome to Haki Yetu! Registered as a ${role}.`);

      // Show loading screen during redirect
      setIsRedirecting(true);

      // 3. REDIRECT BASED ON ROLE with delay for animation
      setTimeout(() => {
        if (role === 'client') {
          navigate('/client/onboarding');
        } else {
          navigate('/lawyer/onboarding');
        }
      }, 1000);

    } catch (err) {
      console.error('Registration error:', err);
      console.error('Full Axios Error Object:', err);
      if (err.response) {
        console.log('Status:', err.response.status);
        console.log('Headers:', err.response.headers);
        console.error('Error response data:', err.response.data);
      }
      // Handle duplicates or other errors
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';

      if (errorMessage.toLowerCase().includes('already exists') ||
        errorMessage.toLowerCase().includes('already registered') ||
        errorMessage.includes('IntegrityError')) {
        toast.error('This email or phone is already registered. Please login.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 bg-white dark:bg-gray-900 font-sans transition-colors relative">

      {/* Loading Overlay - shown within the page during redirect */}
      {isRedirecting && <LoadingScreen message="Setting up your account" overlay={true} />}

      {/* LEFT COLUMN: BRANDING (25%) */}
      <div className="hidden lg:relative lg:flex lg:col-span-1 flex-col justify-between bg-slate-900 text-white p-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/kenya_flag_flowing.png"
            alt="Kenya Flag"
            className="w-full h-full object-cover"
            style={{ opacity: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md border-b-4 border-[#FACC15] pb-2">Haki Yetu</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-full inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-100 border border-white/10 mb-6">
            <CheckCircle size={14} className="text-green-400" />
            Trusted Platform
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Legal Services, <br />
            Simplified.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Connect with verified advocates for instant notarization and legal advice.
          </p>
        </div>

        <div className="relative z-10 mt-8">
          <div className="flex -space-x-2 mb-3">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-8 h-8 rounded-full border-2 border-slate-900" alt="User" />
            ))}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold border-2 border-slate-900">
              +2k
            </div>
          </div>
          <p className="text-xs text-slate-400">Join thousands of Kenyan citizens.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: FORM (75%) */}
      <div className="lg:col-span-3 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join Haki Yetu today. <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline">Sign in</Link> if you already have an account.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'client'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
            >
              <User size={18} />
              I am a Client
            </button>
            <button
              type="button"
              onClick={() => setRole('lawyer')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'lawyer'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Briefcase size={18} />
              I am a Lawyer
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="e.g. Wangari"
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="e.g. Maathai"
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="07XX XXX XXX"
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  maxLength={16}
                  placeholder="Create a strong password"
                  className={`block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition pr-10 ${formData.password.length > 0
                    ? isPasswordValid
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-orange-400 focus:ring-orange-400'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500'
                    }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Password must contain:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.hasMinLength ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasMaxLength ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasMaxLength ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>Max 16 chars</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.hasUpperCase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.hasLowerCase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.hasNumber ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.hasSymbol ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>Symbol (!@#$%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-gray-50 dark:bg-gray-800"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed">
                I have read and agree to the{' '}
                <Link
                  to="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline font-medium"
                >
                  Terms of Service
                </Link>
                ,{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link
                  to="/cookie-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline font-medium"
                >
                  Cookie Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="animate-spin w-5 h-5" /> : 'Create Account'}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4">
              <Shield size={12} className="text-green-500" />
              <span>Verified by Law Society of Kenya Standards</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
