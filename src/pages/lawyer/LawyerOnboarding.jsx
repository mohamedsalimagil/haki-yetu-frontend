import React, { useState } from 'react';
import api from '../../services/api';

const LawyerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lsk_number: '',
    specialization: '',
    experience_years: '',
    bio: '',
    license_doc: null,
    bar_cert: null,
    id_doc: null
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Helper to handle text inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to handle file inputs
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    // Day 3 Critical: Package everything into FormData
    const data = new FormData();
    data.append('lsk_number', formData.lsk_number);
    data.append('specialization', formData.specialization);
    data.append('experience_years', formData.experience_years);
    data.append('bio', formData.bio);
    
    // Append the three documents required by the backend
    if (formData.license_doc) data.append('license_doc', formData.license_doc);
    if (formData.bar_cert) data.append('bar_cert', formData.bar_cert);
    if (formData.id_doc) data.append('id_doc', formData.id_doc);

    try {
      await api.post('/lawyer/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStep(4); // Move to Success state
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Registration failed. Check your details and file sizes.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Lawyer Professional Onboarding</h2>
      
      {/* Step Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ 
            flex: 1,
            textAlign: 'center',
            color: step === s ? '#3498db' : '#bdc3c7', 
            fontWeight: step === s ? 'bold' : 'normal',
            borderBottom: step === s ? '3px solid #3498db' : '1px solid #eee',
            paddingBottom: '10px'
          }}>
            Step {s}
          </div>
        ))}
      </div>

      {status.message && (
        <div style={{ 
          color: status.type === 'error' ? '#e74c3c' : '#2ecc71', 
          backgroundColor: status.type === 'error' ? '#fdecea' : '#eafaf1',
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '15px', 
          textAlign: 'center' 
        }}>
          {status.message}
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Professional Identification</h3>
          <label>LSK Number</label>
          <input 
            name="lsk_number"
            type="text" 
            placeholder="e.g., LSK/2025/1234" 
            value={formData.lsk_number}
            onChange={handleInputChange}
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <label>Area of Specialization</label>
          <input 
            name="specialization"
            type="text" 
            placeholder="e.g., Family Law, Commercial Litigation" 
            value={formData.specialization}
            onChange={handleInputChange}
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={nextStep} style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Experience & Background</h3>
          <label>Years of Experience</label>
          <input 
            name="experience_years"
            type="number" 
            placeholder="Total years in practice" 
            value={formData.experience_years}
            onChange={handleInputChange}
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <label>Professional Bio</label>
          <textarea 
            name="bio"
            placeholder="Provide a brief summary for your public profile..." 
            rows="5"
            value={formData.bio}
            onChange={handleInputChange}
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={prevStep} style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '5px', background: 'white' }}>Back</button>
            <button onClick={nextStep} style={{ flex: 1, padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Verification Documents</h3>
          <p style={{ fontSize: '14px', color: '#7f8c8d' }}>Upload PDF or high-quality images of the following:</p>
          
          <label><b>1. Practicing License</b></label>
          <input name="license_doc" type="file" onChange={handleFileChange} />

          <label><b>2. Bar Certificate</b></label>
          <input name="bar_cert" type="file" onChange={handleFileChange} />

          <label><b>3. National ID Document</b></label>
          <input name="id_doc" type="file" onChange={handleFileChange} />

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={prevStep} style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '5px', background: 'white' }} disabled={loading}>Back</button>
            <button 
              onClick={handleSubmit} 
              style={{ flex: 1, padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
              disabled={loading}
            >
              {loading ? 'Submitting Application...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
          <h3>Application Submitted!</h3>
          <p>The Haki Yetu compliance team will review your credentials and documents. You will be notified via email once your profile is verified.</p>
          <button onClick={() => window.location.href='/dashboard'} style={{ padding: '12px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default LawyerOnboarding;