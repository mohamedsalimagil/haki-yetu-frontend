import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, Clock, Shield, FileText, Camera, AlertCircle, ArrowRight } from 'lucide-react';

const NotarizationFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const steps = [
    { id: 1, title: 'Upload Document', description: 'Upload your document for notarization' },
    { id: 2, title: 'Identity Verification', description: 'Verify your identity securely' },
    { id: 3, title: 'Video Call', description: 'Live video verification with advocate' },
    { id: 4, title: 'Payment & Completion', description: 'Complete payment and receive notarized document' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep(2);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      <section className="bg-white py-16 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E40AF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            LSK Accredited Notarization
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Remote Document<br />
            <span className="text-[#1E40AF]">Notarization</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your documents notarized digitally from anywhere in Kenya. Our LSK-accredited advocates provide secure, legally binding notarization services.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Legally Binding</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>24-48 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step.id <= currentStep
                      ? 'bg-[#1E40AF] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="h-6 w-6" /> : step.id}
                  </div>
                  <div className="text-center mt-3 max-w-24">
                    <h3 className={`font-semibold text-sm ${step.id <= currentStep ? 'text-[#1E40AF]' : 'text-gray-600'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 mt-[-20px] ${
                    step.id < currentStep ? 'bg-[#1E40AF]' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Upload Document */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <Upload className="h-16 w-16 text-[#1E40AF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Document</h2>
                <p className="text-gray-600">Upload the document you need notarized. We accept PDF, DOC, and image files.</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E40AF] transition">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Click to upload or drag and drop</p>
                  <p className="text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </label>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1E40AF] mb-2">What documents can be notarized?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Affidavits and statutory declarations</li>
                  <li>• Power of attorney documents</li>
                  <li>• Contracts and agreements</li>
                  <li>• Wills and testaments</li>
                  <li>• Academic certificates</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Identity Verification */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 text-[#1E40AF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                <p className="text-gray-600">We need to verify your identity to ensure legal compliance.</p>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">Successfully uploaded</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Required Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Valid National ID or Passport</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Current residential address proof</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Phone number verification</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#FACC15] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Why do we need this?</h4>
                      <p className="text-sm text-gray-600">
                        Identity verification ensures the legal validity of your notarized documents and complies with Kenyan law requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Video Call */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <Camera className="h-16 w-16 text-[#1E40AF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Video Verification</h2>
                <p className="text-gray-600">Schedule a live video call with an LSK-accredited advocate.</p>
              </div>

              <div className="bg-[#F9FAFB] p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Today 2:00 PM', 'Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 2:00 PM'].map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 border rounded-lg text-sm font-medium transition ${
                        selectedTimeSlot === slot
                          ? 'border-[#1E40AF] bg-[#1E40AF] text-white'
                          : 'border-gray-300 hover:border-[#1E40AF]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {selectedTimeSlot && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                      Selected: <span className="font-semibold">{selectedTimeSlot}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-[#1E40AF] mb-3">What happens during the call?</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Verify your identity with government-issued ID</li>
                  <li>• Review and confirm the document details</li>
                  <li>• Witness your electronic signature</li>
                  <li>• Receive immediate notarization certificate</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Payment & Completion */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Notarization</h2>
                <p className="text-gray-600">Review details and complete secure payment.</p>
              </div>

              <div className="bg-[#F9FAFB] p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Document Notarization</span>
                    <span className="font-semibold">KES 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span className="font-semibold">KES 100</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>KES 600</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">Ready for Notarization</h4>
                    <p className="text-sm text-green-700">
                      All requirements met. Your document will be notarized and delivered within 24-48 hours after payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => navigate('/checkout/notarization', { 
                    state: { 
                      service: 'Document Notarization',
                      amount: 600,
                      timeSlot: selectedTimeSlot,
                      document: uploadedFile?.name
                    } 
                  })}
                  className="bg-[#1E40AF] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition inline-flex items-center justify-center"
                >
                  Complete Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <p className="text-sm text-gray-500 mt-3">Secure payment powered by M-Pesa</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full ${
                    step.id <= currentStep ? 'bg-[#1E40AF]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !uploadedFile}
                className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg font-medium hover:bg-blue-800 transition inline-flex items-center gap-2"
              >
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
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
                Secure digital notarization services for all Kenyans.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Shield className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <FileText className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white transition">Document Services</Link></li>
                <li><Link to="/services/notarization" className="hover:text-white transition">Notarization</Link></li>
                <li><Link to="/advocates" className="hover:text-white transition">Legal Consultation</Link></li>
                <li><Link to="/services" className="hover:text-white transition">Business Law</Link></li>
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

export default NotarizationFlow;
