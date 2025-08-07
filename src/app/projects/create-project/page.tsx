'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  FileText, 
  Users, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  Plus,
  User
} from 'lucide-react';
import Link from 'next/link';

interface Client {
  _id: string;
  name: string;
}

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("not started");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string, 
    client?: string, 
    description?: string,
    startDate?: string,
    endDate?: string
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const statusOptions = [
    { value: 'not started', label: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    { value: 'in progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle }
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:5000/api/clients", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }

        const data = await res.json();
        setClients(Array.isArray(data) ? data : data.clients || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setClientsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const validateForm = () => {
    const newErrors: {
      title?: string, 
      client?: string, 
      description?: string,
      startDate?: string,
      endDate?: string
    } = {};
    
    if (!title.trim()) newErrors.title = "Project title is required";
    if (!client.trim()) newErrors.client = "Client selection is required";
    if (!description.trim()) newErrors.description = "Project description is required";
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const projectData = {
        title,
        description,
        client,
        status,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/projects"), 2000);
      } else {
        alert(data.message || "Error creating project");
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            Project Created Successfully!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Your new project has been added to the dashboard
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
#      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href='/projects' 
              className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-emerald-100 transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:text-emerald-600" />
              </div>
              <span className="font-medium">Back to Projects</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Create New Project
            </h1>
            <p className="text-emerald-100 text-lg">
              Set up a new project and start tracking your progress
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                    </div>
                    Project Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Briefcase className="w-4 h-4 mr-2 text-emerald-600" />
                    Project Title *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 ${
                      errors.title 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Enter a descriptive project title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                    }}
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-emerald-600" />
                    Project Description *
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-400 resize-none ${
                      errors.description 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Describe the project scope, objectives, and key deliverables..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                    }}
                    disabled={loading}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                    Project Status
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white cursor-pointer"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={loading}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    Client & Timeline
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm font-semibold text-gray-700">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-emerald-600" />
                      Select Client *
                    </span>
                    <Link
                      href="/clients/create"
                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Client
                    </Link>
                  </label>
                  
                  <div className="relative">
                    <select
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white ${
                        errors.client 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      } ${loading || clientsLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                      value={client}
                      onChange={(e) => {
                        setClient(e.target.value);
                        if (errors.client) setErrors(prev => ({ ...prev, client: undefined }));
                      }}
                      disabled={loading || clientsLoading}
                    >
                      <option value="">
                        {clientsLoading ? 'Loading clients...' : 'Choose a client for this project'}
                      </option>
                      {clients.map((clientItem) => (
                        <option key={clientItem._id} value={clientItem._id}>
                          {clientItem.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {clientsLoading ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : (
                        <ChevronDown className={`w-5 h-5 ${errors.client ? 'text-red-500' : 'text-gray-400'}`} />
                      )}
                    </div>
                  </div>
                  
                  {errors.client && (
                    <p className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.client}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        errors.startDate 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (errors.startDate) setErrors(prev => ({ ...prev, startDate: undefined }));
                      }}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                      End Date
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        errors.endDate 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (errors.endDate) setErrors(prev => ({ ...prev, endDate: undefined }));
                      }}
                      disabled={loading}
                      min={startDate}
                    />
                    {errors.endDate && (
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {status && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Status:</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                      statusOptions.find(s => s.value === status)?.color
                    }`}>
                      {(() => {
                        const StatusIcon = statusOptions.find(s => s.value === status)?.icon || AlertCircle;
                        return <StatusIcon className="w-4 h-4" />;
                      })()}
                      {statusOptions.find(s => s.value === status)?.label}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Link
                  href="/projects"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 order-2 sm:order-1"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={loading || clientsLoading}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 order-1 sm:order-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Project
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
}