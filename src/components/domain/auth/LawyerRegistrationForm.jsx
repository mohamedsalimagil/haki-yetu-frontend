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

  // Step 3: Document state
  const [documents, setDocuments] = useState({
    practicing_certificate: null,
    national_id: null,
    resume: null
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
      case 3:
        if (!documents.practicing_certificate || !documents.national_id || !documents.resume) {
          setError('All required documents must be uploaded: Practicing Certificate, National ID/Passport, and CV');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent any form submission

    console.log('handleNext called for step:', currentStep);

    if (validateStep(currentStep)) {
      console.log('Validation passed, moving to step:', currentStep + 1);
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Validation failed for step:', currentStep);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // ✅ 3. The Critical Fix: Handle Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the current step (especially Step 3 logic) before submitting
    if (!validateStep(currentStep)) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append('lsk_number', formData.lskNumber);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('specialization', formData.specializations.join(', ')); // Map array to single string
      formDataToSend.append('experience_years', parseInt(formData.yearsOfExperience, 10) || 0);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('languages', JSON.stringify(formData.languages));
      formDataToSend.append('education', formData.education);
      formDataToSend.append('certifications', formData.certifications);
      formDataToSend.append('bar_admission', formData.barAdmission);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('kra_pin', formData.kraPin);

      // Add file fields
      formDataToSend.append('practicing_certificate', documents.practicing_certificate);
      formDataToSend.append('national_id', documents.national_id);
      formDataToSend.append('resume', documents.resume);

      console.log("Submitting FormData with files");

      if (user) {
        // --- SCENARIO A: User is already logged in ---
        console.log("Submitting lawyer profile for existing user...");

        // Use FormData endpoint (let Axios handle Content-Type automatically)
        await api.post('/lawyer/register', formDataToSend);

        toast.success("Profile submitted for verification!");
        navigate('/verification-pending'); // Send them to verification pending page

      } else {
        // --- SCENARIO B: Brand new user (Fallback) ---
        // This runs if they somehow accessed this form without logging in first

        // For new users, we need to handle registration differently since files are involved
        // First register the user, then upload documents separately
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'lawyer',
          phone: formData.phone,
          first_name: formData.name.split(' ')[0],
          last_name: formData.name.split(' ').slice(1).join(' '),
          gender: formData.gender,
          kra_pin: formData.kraPin
        };

        const result = await register(registrationData);

        if (!result.success) {
          throw new Error(result.message || "Registration failed");
        }

        // After successful registration, upload the profile with documents
        await api.post('/lawyer/register', formDataToSend);

        toast.success('Registration and documents submitted successfully!');
        navigate('/verification-pending');
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
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
              ? 'bg-blue-600 text-white' // Updated color to match theme
              : 'bg-gray-200 text-gray-600'
              }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>

      {/* --- NEW FIELDS FOR LAWYER REGISTRATION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gender Field */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* KRA PIN Field */}
        <div>
          <label htmlFor="kraPin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            KRA PIN *
          </label>
          <input
            id="kraPin"
            name="kraPin"
            type="text"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="A001234567Z"
            value={formData.kraPin}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="Enter your full legal name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="Enter your professional email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="+254 XXX XXX XXX"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Professional Credentials</h3>

      <div>
        <label htmlFor="lskNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          LSK Number *
        </label>
        <input
          id="lskNumber"
          name="lskNumber"
          type="text"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="e.g., LSK/1234/2020"
          value={formData.lskNumber}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your Law Society of Kenya registration number</p>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Professional Bio *
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
          placeholder="Describe your legal expertise, experience, and practice areas..."
          value={formData.bio}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum 500 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Areas of Specialization *
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
            >
              {spec}
              <button
                type="button"
                onClick={() => removeSpecialization(spec)}
                className="ml-1 text-blue-800 dark:text-blue-300 hover:text-red-600 dark:hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
            placeholder="e.g., 5"
            value={formData.yearsOfExperience}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700"
            placeholder="e.g., Nairobi"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Languages Spoken
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="ml-1 text-green-800 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // File handling functions
  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic validation (size < 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${field.replace('_', ' ')} is too large. Max size is 5MB.`);
        return;
      }
      setDocuments({ ...documents, [field]: file });
      toast.success(`${field.replace('_', ' ')} uploaded successfully`);
    }
  };

  const removeFile = (field) => {
    setDocuments({ ...documents, [field]: null });
    // Clear the input value
    const input = document.getElementById(field);
    if (input) input.value = '';
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Document Verification</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Please upload the required documents to complete your registration. All documents are required for verification.
      </p>

      {/* Practicing Certificate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Practicing Certificate *
        </label>
        {!documents.practicing_certificate ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
            <input
              type="file"
              id="practicing_certificate"
              onChange={(e) => handleFileChange('practicing_certificate', e)}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="practicing_certificate" className="cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Click to upload Practicing Certificate</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
            </label>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">{documents.practicing_certificate.name}</p>
                <p className="text-xs text-green-600">{(documents.practicing_certificate.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile('practicing_certificate')}
              className="p-2 hover:bg-green-100 rounded-full text-green-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* National ID / Passport */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          National ID / Passport *
        </label>
        {!documents.national_id ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
            <input
              type="file"
              id="national_id"
              onChange={(e) => handleFileChange('national_id', e)}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="national_id" className="cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Click to upload National ID / Passport</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
            </label>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">{documents.national_id.name}</p>
                <p className="text-xs text-green-600">{(documents.national_id.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile('national_id')}
              className="p-2 hover:bg-green-100 rounded-full text-green-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Curriculum Vitae (CV) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Curriculum Vitae (CV) *
        </label>
        {!documents.resume ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
            <input
              type="file"
              id="resume"
              onChange={(e) => handleFileChange('resume', e)}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="resume" className="cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Click to upload Curriculum Vitae</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC or DOCX (Max 5MB)</p>
            </label>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">{documents.resume.name}</p>
                <p className="text-xs text-green-600">{(documents.resume.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile('resume')}
              className="p-2 hover:bg-green-100 rounded-full text-green-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Document Requirements
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>All documents must be clear and legible</li>
                <li>Practicing Certificate must be current and valid</li>
                <li>ID/Passport must show your full name and photo</li>
                <li>CV should include your professional experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Lawyer Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
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
                onClick={handleNext}
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
