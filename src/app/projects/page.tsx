'use client'
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Plus, 
  Loader2, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  PenSquare,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  title: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  client?: {
    _id: string;
    name: string;
  };
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch("http://localhost:5000/api/projects", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(projectId);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(prev => prev.filter(project => project._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2, dot: 'bg-emerald-500' };
      case 'in progress':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, dot: 'bg-blue-500' };
      case 'not started':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, dot: 'bg-gray-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, dot: 'bg-gray-500' };
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const statusColors = getStatusColor(project.status);
    const StatusIcon = statusColors.icon;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-emerald-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-lg">{project.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{project.client?.name || "Not assigned"}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} whitespace-nowrap`}>
            <div className={`w-2 h-2 rounded-full ${statusColors.dot}`}></div>
            {project.status || 'Not specified'}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">Start:</span>
              <span>{formatDate(project.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">End:</span>
              <span>{formatDate(project.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Link
              href={`/projects/view/${project._id}`}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors font-medium text-sm"
            >
              <Eye className="w-4 h-4" />
              View Details
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={`/projects/edit/${project._id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit project"
            >
              <PenSquare className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDeleteProject(project._id)}
              disabled={deleteLoading === project._id}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete project"
            >
              {deleteLoading === project._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Project Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  Project Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-base">
                  Manage and track all your active projects in one place
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{projects.length} total projects</span>
                  <span>•</span>
                  <span>{filteredProjects.length} showing</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects or clients..."
                    className="w-full pl-10 pr-4 py-3 border placeholder-gray-500 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Add Project Button */}
                <Link
                  href="/projects/create-project"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProjects.length > 0 && (
                <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Projects</div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-emerald-600">
                        {projects.filter(p => p.status?.toLowerCase() === 'in progress').length}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">In Progress</div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-teal-600">
                        {projects.filter(p => p.status?.toLowerCase() === 'completed').length}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Completed</div>
                    </div>
                  </div>
                </div>
              )}
              </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
              {/* <p className="text-gray-900">Loading your projects...</p> */}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-200 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? "No matching projects found" : "No projects yet"}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm 
                  ? "Try adjusting your search criteria" 
                  : "Get started by creating your first project and begin tracking your work"}
              </p>
              {!searchTerm && (
                <Link 
                  href="/projects/create-project" 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Project
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
              
              {/* Projects Summary */}
              
            </>
          )}
        </div>
      </div>
    </>
  );
}