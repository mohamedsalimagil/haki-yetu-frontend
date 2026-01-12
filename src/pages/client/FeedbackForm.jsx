import React, { useState } from 'react';
import { Star, Upload, Send, HelpCircle } from 'lucide-react';

const FeedbackForm = () => {
  const feedbackServices = [
    { value: '', label: 'Select a service (e.g., Remote Notarization)' },
    { value: 'remote-notarization', label: 'Remote Notarization' },
    { value: 'document-generation', label: 'Document Generation' },
    { value: 'legal-consultation', label: 'Legal Consultation' },
    { value: 'land-search', label: 'Land Search' },
    { value: 'affidavit-drafting', label: 'Affidavit Drafting' },
    { value: 'other', label: 'Other' },
  ];

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [service, setService] = useState('');
  const [story, setStory] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for sharing your experience! Your story helps other Kenyans find the legal help they need.');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A1E41] mb-2">Share Your Haki Yetu Experience</h1>
          <p className="text-slate-500">Your story helps other Kenyans find the legal help they need.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Upload size={24} className="text-[#2563EB]" />
              </div>
              <h3 className="font-bold text-[#0A1E41] mb-2">Why your voice matters</h3>
              <p className="text-sm text-slate-600 mb-4">
                Sharing your success story provides reassurance to others that their legal matters can be resolved quickly and fairly.
              </p>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">Trusted by over 10,000 Kenyans</p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#D9A13A] fill-[#D9A13A]" />
                  ))}
                  <span className="text-sm font-bold text-[#0A1E41]">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={20} className="text-[#2563EB]" />
                <h3 className="font-bold text-[#0A1E41]">Need help with your case?</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                If your legal matter is still ongoing, contact support directly.
              </p>
              <button className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-[#0A1E41] mb-3">How would you rate our service?</label>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'text-[#D9A13A] fill-[#D9A13A]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-sm font-medium text-slate-600">
                      {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-bold text-[#0A1E41] mb-2">
                  What legal service did we assist you with?
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  required
                >
                  {feedbackServices.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Success Story */}
              <div>
                <label className="block text-sm font-bold text-[#0A1E41] mb-2">
                  Your Success Story
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell us how Haki Yetu helped resolve your legal matter..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
                  required
                />
                <p className="text-xs text-slate-400 mt-2">Min. 50 characters • {story.length}/500</p>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold text-[#0A1E41] mb-2">
                  Add a photo (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2563EB] hover:bg-blue-50 transition cursor-pointer">
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Upload a file or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Privacy & Attribution */}
              <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-[#0A1E41] text-sm">Privacy & Attribution</h4>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!anonymous}
                    onChange={() => setAnonymous(false)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Post with my name</p>
                    <p className="text-xs text-slate-500">Your first name and profile photo will be visible</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={anonymous}
                    onChange={() => setAnonymous(true)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Post anonymously</p>
                    <p className="text-xs text-slate-500">Your identity will remain private</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-gray-200">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <div>
                    <p className="text-xs text-slate-600">
                      I agree to publish this story and give Haki Yetu permission to share this story.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!consent || rating === 0 || !service || story.length < 50}
                  className="flex-1 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Submit Story
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
