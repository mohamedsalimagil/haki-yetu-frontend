import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../../context/ToastContext';

const LawyerOfficesTab = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      // Mock data - in real app this would come from API
      const mockOffices = [
        {
          id: 1,
          name: 'Westlands Main Office',
          address: 'Westlands Road, Nairobi',
          city: 'Nairobi',
          phone: '+254712345678',
          email: 'westlands@haki-law.co.ke',
          is_primary: true,
          operating_hours: {
            monday: '8:00 AM - 5:00 PM',
            tuesday: '8:00 AM - 5:00 PM',
            wednesday: '8:00 AM - 5:00 PM',
            thursday: '8:00 AM - 5:00 PM',
            friday: '8:00 AM - 5:00 PM',
            saturday: '9:00 AM - 2:00 PM',
            sunday: 'Closed'
          },
          created_at: '2025-01-15T08:00:00Z'
        },
        {
          id: 2,
          name: 'Kilimani Branch',
          address: 'Luthuli Avenue, Kilimani',
          city: 'Nairobi',
          phone: '+254723456789',
          email: 'kilimani@haki-law.co.ke',
          is_primary: false,
          operating_hours: {
            monday: '9:00 AM - 6:00 PM',
            tuesday: '9:00 AM - 6:00 PM',
            wednesday: '9:00 AM - 6:00 PM',
            thursday: '9:00 AM - 6:00 PM',
            friday: '9:00 AM - 6:00 PM',
            saturday: '10:00 AM - 3:00 PM',
            sunday: 'Closed'
          },
          created_at: '2025-03-20T10:30:00Z'
        }
      ];
      setOffices(mockOffices);
    } catch (err) {
      showError('Failed to load office locations');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Office name is required')
      .min(3, 'Office name must be at least 3 characters'),
    address: Yup.string()
      .required('Address is required')
      .min(10, 'Please provide a complete address'),
    city: Yup.string()
      .required('City is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^(\+254|254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    is_primary: Yup.boolean(),
    operating_hours: Yup.object().shape({
      monday: Yup.string().required('Monday hours are required'),
      tuesday: Yup.string().required('Tuesday hours are required'),
      wednesday: Yup.string().required('Wednesday hours are required'),
      thursday: Yup.string().required('Thursday hours are required'),
      friday: Yup.string().required('Friday hours are required'),
      saturday: Yup.string(),
      sunday: Yup.string()
    })
  });

  const defaultOperatingHours = {
    monday: '8:00 AM - 5:00 PM',
    tuesday: '8:00 AM - 5:00 PM',
    wednesday: '8:00 AM - 5:00 PM',
    thursday: '8:00 AM - 5:00 PM',
    friday: '8:00 AM - 5:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed'
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingOffice) {
        // Update existing office
        setOffices(prev => prev.map(office =>
          office.id === editingOffice.id
            ? { ...office, ...values, updated_at: new Date().toISOString() }
            : office
        ));
        success('Office updated successfully!');
      } else {
        // Create new office
        const newOffice = {
          id: Date.now(),
          ...values,
          created_at: new Date().toISOString()
        };
        setOffices(prev => [...prev, newOffice]);
        success('Office added successfully!');
      }

      setShowForm(false);
      setEditingOffice(null);
      resetForm();

    } catch (err) {
      showError('Failed to save office information');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (office) => {
    setEditingOffice(office);
    setShowForm(true);
  };

  const handleDelete = async (officeId) => {
    if (!window.confirm('Are you sure you want to delete this office location?')) {
      return;
    }

    try {
      // In real app, this would call the API
      setOffices(prev => prev.filter(office => office.id !== officeId));
      success('Office deleted successfully!');
    } catch (err) {
      showError('Failed to delete office');
    }
  };

  const handleSetPrimary = async (officeId) => {
    try {
      // Update all offices to set only this one as primary
      setOffices(prev => prev.map(office => ({
        ...office,
        is_primary: office.id === officeId
      })));
      success('Primary office updated successfully!');
    } catch (err) {
      showError('Failed to update primary office');
    }
  };

  const formatOperatingHours = (hours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((day, index) => (
      <div key={day} className="flex justify-between text-sm">
        <span className="font-medium">{dayNames[index]}:</span>
        <span className="text-gray-600">{hours[day]}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Office Locations</h3>
          <p className="text-sm text-gray-600">
            Manage your office locations and contact information
          </p>
        </div>
        <button
          onClick={() => {
            setEditingOffice(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Office</span>
        </button>
      </div>

      {/* Office Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingOffice ? 'Edit Office Location' : 'Add New Office Location'}
          </h4>

          <Formik
            initialValues={{
              name: editingOffice?.name || '',
              address: editingOffice?.address || '',
              city: editingOffice?.city || '',
              phone: editingOffice?.phone || '',
              email: editingOffice?.email || '',
              is_primary: editingOffice?.is_primary || false,
              operating_hours: editingOffice?.operating_hours || defaultOperatingHours
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Office Name
                    </label>
                    <Field
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Westlands Main Office"
                    />
                    <ErrorMessage name="name" component="div" className="text-sm text-red-600 mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Field
                      name="city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Nairobi"
                    />
                    <ErrorMessage name="city" component="div" className="text-sm text-red-600 mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <Field
                    name="address"
                    as="textarea"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Complete office address"
                  />
                  <ErrorMessage name="address" component="div" className="text-sm text-red-600 mt-1" />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="+254712345678"
                    />
                    <ErrorMessage name="phone" component="div" className="text-sm text-red-600 mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="office@haki-law.co.ke"
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-red-600 mt-1" />
                  </div>
                </div>

                {/* Primary Office Checkbox */}
                <div className="flex items-center">
                  <Field
                    name="is_primary"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Set as primary office location
                  </label>
                </div>

                {/* Operating Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Operating Hours
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(values.operating_hours).map(([day, hours]) => (
                      <div key={day}>
                        <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                          {day}
                        </label>
                        <Field
                          name={`operating_hours.${day}`}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 8:00 AM - 5:00 PM"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingOffice(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : (editingOffice ? 'Update Office' : 'Add Office')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Offices List */}
      <div className="space-y-4">
        {offices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h4 className="text-lg font-medium mb-2">No office locations</h4>
            <p className="text-sm">Add your first office location to get started</p>
          </div>
        ) : (
          offices.map((office) => (
            <div
              key={office.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 flex items-center">
                        {office.name}
                        {office.is_primary && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Primary
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{office.address}, {office.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Operating Hours</span>
                    </div>
                  </div>

                  {/* Operating Hours Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Operating Hours</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formatOperatingHours(office.operating_hours)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-6">
                  {!office.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(office.id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                      title="Set as primary office"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(office)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(office.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Office Management Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Primary office is used as the main contact location for clients</li>
              <li>Each office can have different operating hours and contact information</li>
              <li>Operating hours should reflect actual availability for client appointments</li>
              <li>Ensure all contact information is accurate and up-to-date</li>
              <li>Clients can book appointments at any of your office locations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerOfficesTab;
