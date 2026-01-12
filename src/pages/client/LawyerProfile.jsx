import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Briefcase, Scale, Clock, CheckCircle } from 'lucide-react';

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data (Replace with API call later)
  const lawyer = {
    id: id,
    name: "Advocate John Kamau",
    role: "Advocate of the High Court of Kenya",
    lsk: "P.105/9876",
    specialization: "Family Law Specialist",
    rate: 3500,
    rating: 4.8,
    reviews: 150,
    experience: "12+ Years",
    cases: "500+",
    bio: "John Kamau is a seasoned Advocate of the High Court of Kenya with over 12 years of experience in civil litigation and conveyancing..."
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6 flex flex-col md:flex-row gap-8">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0">
            {/* Avatar Placeholder */}
            <img src={`https://ui-avatars.com/api/?name=${lawyer.name}&background=1e3a8a&color=fff`} className="rounded-full" alt="profile"/>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                <Scale size={16} /> {lawyer.role}
              </p>
              <p className="text-blue-600 text-sm font-medium mt-1">LSK Verified: {lawyer.lsk}</p>
            </div>
            <div className="text-right">
               <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                 <Star fill="currentColor" /> {lawyer.rating}
               </div>
               <span className="text-xs text-gray-400">({lawyer.reviews} Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 border-t pt-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Experience</p>
              <p className="font-bold text-gray-900">{lawyer.experience}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Cases Handled</p>
              <p className="font-bold text-gray-900">{lawyer.cases}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Consultation Fee</p>
              <p className="font-bold text-blue-700">KES {lawyer.rate} <span className="text-sm font-normal text-gray-500">/ 30 min</span></p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => alert("Booking Module (Person B) is currently under development.")}
              className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-lg"
            >
              Book Consultation
            </button>
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <h3 className="font-bold text-lg mb-4">About Advocate Kamau</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{lawyer.bio}</p>

            <h3 className="font-bold text-lg mb-4">Areas of Specialization</h3>
            <div className="flex gap-2 flex-wrap">
                {["Family Law", "Civil Litigation", "Commercial Contracts"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">{tag}</span>
                ))}
            </div>
        </div>

        {/* Reviews Sidebar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Recent Reviews</h3>
            {/* Mock Reviews */}
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Grace M.</span>
                        <div className="flex text-yellow-400 text-xs"><Star size={12} fill="currentColor"/> 5.0</div>
                    </div>
                    <p className="text-gray-500 text-xs">"Very professional and helpful. Solved my land dispute quickly."</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
