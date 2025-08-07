'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ArrowLeft, 
  Loader2,
  Edit,
  Eye,
  Calendar,
  FileText,
  Plus,
  AlertCircle,
  Building,
  Clock,
  CheckCircle,
  RefreshCw,
  Home,
  ExternalLink
} from 'lucide-react';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  createdAt?: string;
}

interface Project {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export default function ClientProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const fetchClientData = async () => {
    if (!id) {
      setError('Client ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const [clientRes, projectRes] = await Promise.all([
        fetch(`http://localhost:5000/api/clients/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`http://localhost:5000/api/projects/client/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
      ]);

      if (!clientRes.ok) {
        if (clientRes.status === 404) {
          throw new Error('Client not found');
        } else if (clientRes.status === 401) {
          throw new Error('Unauthorized access');
        } else {
          throw new Error('Failed to fetch client data');
        }
      }

      const clientData = await clientRes.json();
      setClient(clientData);

      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProjects(Array.isArray(projectData) ? projectData : projectData.projects || []);
      } else {
        console.warn('Failed to fetch projects, continuing without them');
        setProjects([]);
      }

    } catch (err) {
      console.error("Failed to load client data", err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading client data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleRetry = () => {
    fetchClientData();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusInfo = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-emerald-100 text-emerald-800',
          icon: CheckCircle
        };
      case 'in progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Clock
        };
      case 'not started':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
    }
  };

  // Loading State
  if (loading && !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Client Profile</h2>
            <p className="text-gray-600">Please wait while we fetch the client information...</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {error.includes('not found') ? 'Client Not Found' : 'Error Loading Client'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/clients"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Clients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
       
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Client Not Found</h2>
            <p className="text-gray-600 mb-6">
              The requested client could not be found. It may have been deleted or the ID is incorrect.
            </p>
            <Link
              href="/clients"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Clients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{client.name} - Client Profile</title>
        <meta name="description" content={`Client profile for ${client.name} - View contact information and projects`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              
              
              <div className="flex items-center gap-3">
                <Link
                  href={`/clients/edit/${client._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <Link
                  href={`/projects/create?clientId=${client._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Project</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

       
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{client.name}</h1>
                  <p className="text-emerald-100 text-lg">Client Profile</p>
                  {client.createdAt && (
                    <p className="text-emerald-200 text-sm mt-1">
                      Member since {formatDate(client.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

           
            <div className="px-6 sm:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-gray-900 font-semibold">{client.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <a 
                          href={`mailto:${client.email}`}
                          className="text-gray-900 font-semibold hover:text-blue-600 transition-colors truncate block"
                        >
                          {client.email}
                        </a>
                      </div>
                    </div>

                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <a 
                          href={`tel:${client.phone}`}
                          className="text-gray-900 font-semibold hover:text-purple-600 transition-colors"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>

                    
                    {client.company && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Building className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company</p>
                          <p className="text-gray-900 font-semibold">{client.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

               
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                      </div>
                      Quick Overview
                    </h3>
                  </div>

                 
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {projects.length === 1 ? 'Active project' : 'Total projects'}
                    </p>
                  </div>

                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
                    
                    <Link
                      href={`/clients/edit/${client._id}`}
                      className="flex items-center gap-3 p-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-colors group"
                    >
                      <Edit className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Edit Client Info</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </Link>

                    <Link
                      href={`/projects/create?clientId=${client._id}`}
                      className="flex items-center gap-3 p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors group"
                    >
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-800 font-medium">Create New Project</span>
                      <ExternalLink className="w-4 h-4 text-emerald-600 ml-auto" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
                <p className="text-emerald-100">All projects for this client</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm text-white font-medium">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </span>
                <Link
                  href={`/projects/create?clientId=${client._id}`}
                  className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Link>
              </div>
            </div>
            
            <div className="px-6 sm:px-8 py-8">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Projects Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    This client doesn't have any projects yet. Create the first project to get started.
                  </p>
                  <Link
                    href={`/projects/create?clientId=${client._id}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Project
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map((project) => {
                    const statusInfo = getStatusInfo(project.status);
                    const StatusIcon = statusInfo.icon;
                    const projectTitle = project.title || project.name || 'Untitled Project';
                    
                    return (
                      <div key={project._id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {projectTitle}
                            </h3>
                            {project.status && (
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {project.status}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {project.description && (
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Start: {formatDate(project.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>End: {formatDate(project.endDate)}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <Link
                            href={`/projects/${project._id}`}
                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Link>
                          <Link
                            href={`/projects/edit/${project._id}`}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Project</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}