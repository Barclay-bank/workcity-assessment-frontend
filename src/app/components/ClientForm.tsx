'use client'
import React, { useState, FormEvent } from 'react';
import { User, Mail, Phone, Save, UserPlus, Loader2, CheckCircle, AlertCircle, ArrowLeft, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ClientFormProps = {
  initialData?: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    _id?: string;
  };
  isEditMode?: boolean;
};

const ClientForm = ({ initialData, isEditMode = false }: ClientFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string, 
    email?: string, 
    phone?: string,
    company?: string
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {
      name?: string, 
      email?: string, 
      phone?: string,
      company?: string
    } = {};
    
    if (!name.trim()) newErrors.name = "Client name is required";
    if (!email.trim()) newErrors.email = "Email address is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const clientData = {
        name,
        email,
        phone,
        ...(company && { company })
      };

      let response;
      if (isEditMode && initialData?._id) {
        response = await fetch(`http://localhost:5000/api/clients/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(clientData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(clientData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save client');
      }

      setShowSuccess(true);
      setTimeout(() => router.push("/clients"), 2000);
      
    } catch (err) {
      console.error("Error submitting form:", err);
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isEditMode ? "Client Updated Successfully!" : "Client Created Successfully!"}
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            {isEditMode ? "Changes have been saved to your dashboard" : "New client has been added to your dashboard"}
          </p>
          <div className="flex items-center justify-center text-sm text-emerald-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href='/clients' 
              className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-emerald-100 transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:text-emerald-600" />
              </div>
              <span className="font-medium">Back to Clients</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isEditMode ? (
                <User className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isEditMode ? "Edit Client" : "Add New Client"}
            </h1>
            <p className="text-emerald-100 text-lg">
              {isEditMode ? "Update client information and contact details" : "Create a new client profile for your projects"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8">
            {apiError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">{apiError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-600">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 mr-2 text-emerald-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 text-gray-800 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Enter client's full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="client@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </div>
                    Contact & Company
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 ${
                      errors.phone 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Building className="w-4 h-4 mr-2 text-emerald-600" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 ${
                      errors.company 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Company or organization name (optional)"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      if (errors.company) setErrors(prev => ({ ...prev, company: undefined }));
                    }}
                    disabled={isLoading}
                  />
                </div>

                {(name || email || phone) && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-3">Client Preview:</p>
                    <div className="space-y-2">
                      {name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{name}</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{email}</span>
                        </div>
                      )}
                      {phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{phone}</span>
                        </div>
                      )}
                      {company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Link
                  href="/clients"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 order-2 sm:order-1"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 order-1 sm:order-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isEditMode ? "Updating Client..." : "Creating Client..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Save className="w-5 h-5" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                      {isEditMode ? "Update Client" : "Create Client"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;