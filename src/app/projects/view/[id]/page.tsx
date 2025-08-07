'use client'
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Briefcase, 
  FileText, 
  User, 
  Mail, 
  ArrowLeft, 
  Loader2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  client?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export default function ViewProject() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch project');
        
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 };
      case 'in progress':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock };
      case 'not started':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white p-6 rounded-xl shadow-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Project</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white p-6 rounded-xl shadow-md text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The requested project could not be found.</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = getStatusColor(project.status);
  const StatusIcon = statusColors.icon;

  return (
    <>
      <Head>
        <title>{project.title} | Project Details</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/projects"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">All Projects</span>
          </Link>

          {/* Project Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">{project.title}</h1>
                {project.status && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                    <StatusIcon className="w-3 h-3" />
                    {project.status}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
                    {project.description && (
                      <p className="text-gray-600 mt-2">{project.description}</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Start: {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>End: {formatDate(project.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Client Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Client Information</h3>
                {project.client ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{project.client.name}</p>
                        {project.client.email && (
                          <p className="text-sm text-gray-600 mt-1">{project.client.email}</p>
                        )}
                      </div>
                    </div>
                    {project.client.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-gray-900">{project.client.phone}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No client assigned to this project
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}