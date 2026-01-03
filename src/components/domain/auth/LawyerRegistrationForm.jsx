import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../../services/api'; // Ensure you have your axios instance here

const LawyerRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    kraPin: '',

    // Step 2: Professional Credentials
    lskNumber: '',
    bio: '',
    specializations: [],
    yearsOfExperience: '',
    location: '',
    languages: [],

    // Step 3: Additional Information
    education: '',
    certifications: '',
    barAdmission: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // ✅ 1. Get User and Navigate
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // ✅ 2. Auto-Skip Step 1 if User is Logged In
  useEffect(() => {
    if (user) {
      // Pre-fill data
      setFormData((prev) => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || ''
      }));
      // Jump to Step 2
      setCurrentStep(2);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, newSpecialization.trim()]
      });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter(s => s !== spec)
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== lang)
    });
  };

  const validateStep = (step) => {
    // If user is logged in, skip validation for Step 1
    if (step === 1 && user) return true;

    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || !formData.gender || !formData.kraPin) {
          setError('All personal information fields are required');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        break;
      case 2:
        if (!formData.lskNumber || !formData.bio || formData.specializations.length === 0) {
          setError('LSK Number, Bio, and at least one specialization are required');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // ✅ 3. The Critical Fix: Handle Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare the profile payload
      const lawyerProfileData = {
        lsk_number: formData.lskNumber,
        bio: formData.bio,
        specialization: formData.specializations.join(', '), // Map array to single string
        experience_years: parseInt(formData.yearsOfExperience, 10) || 0,
        location: formData.location,
        languages: formData.languages,
        education: formData.education,
        certifications: formData.certifications,
        bar_admission: formData.barAdmission,
        gender: formData.gender,
        kra_pin: formData.kraPin
      };

      console.log("Submitting Payload:", lawyerProfileData);

        if (user) {
          // --- SCENARIO A: User is already logged in (The Fix) ---
          // We do NOT call register(). We call the endpoint to create/update the profile.
          console.log("Submitting lawyer profile for existing user...");

          // Note: Ensure this endpoint matches your backend route in app/lawyer/routes.py
          // Commonly: /api/lawyer/profile or /api/lawyer/onboarding
          await api.post('/lawyer/profile', lawyerProfileData);

          toast.success("Profile submitted for verification!");
          navigate('/verification-pending'); // Send them to verification pending page

        } else {
          // --- SCENARIO B: Brand new user (Fallback) ---
          // This runs if they somehow accessed this form without logging in first
          const registrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'lawyer', // Changed from 'advocate' to match your system
            phone: formData.phone,
            lawyer_profile: lawyerProfileData
          };

          const result = await register(registrationData);

          if (!result.success) {
            throw new Error(result.error || "Registration failed");
          } else {
            toast.success('Registration successful!');
            navigate('/verification-pending');
          }
        }

      } catch (err) {
        console.error('Profile submission error:', err);
        console.error('Error response data:', err.response?.data);
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Submission failed';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-blue-600 text-white' // Updated color to match theme
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>

      {/* --- NEW FIELDS FOR LAWYER REGISTRATION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gender Field */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* KRA PIN Field */}
        <div>
          <label htmlFor="kraPin" className="block text-sm font-medium text-gray-700 mb-1">
            KRA PIN *
          </label>
          <input
            id="kraPin"
            name="kraPin"
            type="text"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            placeholder="A001234567Z"
            value={formData.kraPin}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter your full legal name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter your professional email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="+254 XXX XXX XXX"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Credentials</h3>

      <div>
        <label htmlFor="lskNumber" className="block text-sm font-medium text-gray-700">
          LSK Number *
        </label>
        <input
          id="lskNumber"
          name="lskNumber"
          type="text"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., LSK/1234/2020"
          value={formData.lskNumber}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500">Your Law Society of Kenya registration number</p>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Professional Bio *
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Describe your legal expertise, experience, and practice areas..."
          value={formData.bio}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500">Maximum 500 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Specialization *
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Corporate Law"
            value={newSpecialization}
            onChange={(e) => setNewSpecialization(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
          />
          <button
            type="button"
            onClick={addSpecialization}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.specializations.map((spec, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {spec}
              <button
                type="button"
                onClick={() => removeSpecialization(spec)}
                className="ml-1 text-blue-800 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 5"
            value={formData.yearsOfExperience}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Nairobi"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., English"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
          />
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.languages.map((lang, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="ml-1 text-green-800 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700">
          Education & Qualifications
        </label>
        <textarea
          id="education"
          name="education"
          rows={3}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="List your educational background and qualifications..."
          value={formData.education}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
          Certifications & Awards
        </label>
        <textarea
          id="certifications"
          name="certifications"
          rows={3}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="List any relevant certifications, awards, or professional memberships..."
          value={formData.certifications}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="barAdmission" className="block text-sm font-medium text-gray-700">
          Bar Admission Details
        </label>
        <input
          id="barAdmission"
          name="barAdmission"
          type="text"
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Date and place of bar admission"
          value={formData.barAdmission}
          onChange={handleChange}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Review Your Information
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Once submitted, your registration will be reviewed by our admin team. You will receive an email notification once your account is approved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Lawyer Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Haki Yetu as a legal professional
          </p>
        </div>

        {renderStepIndicator()}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}

            <div className="flex-1" />

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 border border-transparent rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>

          <div className="text-center pt-4">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyerRegistrationForm;
