import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Briefcase, Award, Calendar,
  MessageCircle, CheckCircle, Clock, ChevronRight
} from 'lucide-react';

const LawyerProfileView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('biography');

  // TODO: Replace with API call to fetch lawyer profile data based on id
  const lawyerProfile = {
    id: id || 'ADV-001',
    name: 'Advocate Profile',
    title: 'Advocate of the High Court of Kenya',
    lskNumber: 'Loading...',
    experience: 'N/A',
    casesHandled: 'N/A',
    rating: 0,
    reviewCount: 0,
    consultationFee: 0,
    verified: false,
    avatar: 'https://ui-avatars.com/api/?name=Lawyer&background=0A1E41&color=fff&size=200',
    specializations: [],
    biography: 'Profile loading...',
    education: [],
    availableSlots: [],
    reviews: [],
  };

  const tabs = ['biography', 'specializations', 'education', 'reviews'];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 transition-colors">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-[#0A1E41] dark:hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Search</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Lawyer Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sticky top-8 transition-colors">
              {/* Profile Image */}
              <div className="relative mb-6">
                <img
                  src={lawyerProfile.avatar}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-gray-700 shadow-lg"
                  alt={lawyerProfile.name}
                />
                {lawyerProfile.verified && (
                  <div className="absolute bottom-2 right-1/2 transform translate-x-16 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#0A1E41] dark:text-white mb-1">{lawyerProfile.name}</h1>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{lawyerProfile.title}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500">LSK Practice No. {lawyerProfile.lskNumber}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-slate-400 dark:text-gray-500 mb-1">Experience</p>
                  <p className="text-lg font-bold text-[#0A1E41] dark:text-white">{lawyerProfile.experience}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 dark:text-gray-500 mb-1">Cases</p>
                  <p className="text-lg font-bold text-[#0A1E41] dark:text-white">{lawyerProfile.casesHandled}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 dark:text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <p className="text-lg font-bold text-[#0A1E41] dark:text-white">{lawyerProfile.rating}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Consultation Fee</p>
                <p className="text-2xl font-bold text-[#0A1E41] dark:text-white">KES {lawyerProfile.consultationFee.toLocaleString()}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Per hour • Tax included</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/client/book/${id}`)}
                  className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  Book Consultation
                </button>
                <button
                  onClick={() => navigate('/client/messages/new')}
                  className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Send Message
                </button>
              </div>

              {/* Next Available Slots */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-[#0A1E41] dark:text-white text-sm mb-4">Next Available Slots</h3>
                <div className="space-y-2">
                  {lawyerProfile.availableSlots.map((slot, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">{slot.date}</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">{slot.time}</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">Available</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/client/book/${id}`)}
                  className="w-full mt-3 py-2 text-sm font-medium text-[#2563EB] dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
                >
                  View Calendar <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === tab
                          ? 'text-[#2563EB] dark:text-blue-400 border-b-2 border-[#2563EB] dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                          : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'biography' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A1E41] dark:text-white mb-4">About {lawyerProfile.name.split(' ')[1]}</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {lawyerProfile.biography.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A1E41] dark:text-white mb-6">Areas of Specialization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lawyerProfile.specializations.map((spec, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A1E41] dark:text-white">{spec}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">Certified Specialist</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-slate-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="font-bold text-[#0A1E41] dark:text-white mb-4 flex items-center gap-2">
                        <Award size={18} className="text-[#D9A13A]" />
                        Professional Memberships
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                          <CheckCircle size={16} className="text-green-500" />
                          Law Society of Kenya (LSK)
                        </li>
                        <li className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                          <CheckCircle size={16} className="text-green-500" />
                          East Africa Law Society
                        </li>
                        <li className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                          <CheckCircle size={16} className="text-green-500" />
                          International Bar Association
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A1E41] dark:text-white mb-6">Education & Credentials</h2>
                    <div className="space-y-6">
                      {lawyerProfile.education.map((edu, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 bg-[#0A1E41] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#0A1E41] dark:text-white mb-1">{edu.degree}</h3>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">{edu.institution}</p>
                            <p className="text-xs text-slate-400 dark:text-gray-500">Graduated {edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#0A1E41] dark:text-white">Client Reviews</h2>
                      <div className="flex items-center gap-2">
                        <Star size={24} className="text-amber-400 fill-amber-400" />
                        <span className="text-2xl font-bold text-[#0A1E41] dark:text-white">{lawyerProfile.rating}</span>
                        <span className="text-sm text-slate-400 dark:text-gray-400">({lawyerProfile.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {lawyerProfile.reviews.map((review) => (
                        <div key={review.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition bg-white dark:bg-gray-700/30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold">
                                {review.client.avatar}
                              </div>
                              <div>
                                <p className="font-semibold text-[#0A1E41] dark:text-white">{review.client.name}</p>
                                <p className="text-xs text-slate-400 dark:text-gray-500">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                      Load More Reviews
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfileView;
