'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  User, 
  LogOut, 
  Users, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  Activity,
  BarChart3,
  Eye,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface Client {
  _id: string
  name: string
  email: string
  phone?: string
  projectsCount?: number
  status?: string
}

interface Project {
  _id: string;
  name: string;
  status: 'not started' | 'in progress' | 'completed' | 'on hold';
  startDate?: string;
  endDate?: string;
  client?: {
    _id: string;
    name: string;
  };
}

interface ActivityItem {
  id: string;
  type: 'project' | 'client' | 'task';
  action: string;
  title: string;
  timestamp: string;
  user?: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        setIsLoading(true)
        
        // Fetch user data
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await userResponse.json()
        setUserName(userData.user?.name || userData.name)

        // Fetch clients data
        const clientsResponse = await fetch('http://localhost:5000/api/clients', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!clientsResponse.ok) {
          throw new Error('Failed to fetch clients data')
        }

        const clientsData = await clientsResponse.json()
        setClients(clientsData.clients || clientsData)

        // Fetch projects data
        const projectsResponse = await fetch('http://localhost:5000/api/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects data')
        }

        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || projectsData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  useEffect(() => {
    const generatedActivities: ActivityItem[] = [
      ...projects.slice(0, 3).map(project => ({
        id: project._id,
        type: 'project' as const,
        action: 'updated',
        title: project.name,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      })),
      ...clients.slice(0, 2).map(client => ({
        id: client._id,
        type: 'client' as const,
        action: 'added',
        title: client.name,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)

    setRecentActivities(generatedActivities)
  }, [projects, clients])

  const projectStats = {
    completed: projects.filter(project => project.status === 'completed').length,
    pending: projects.filter(project => project.status === 'in progress').length,
    notStarted: projects.filter(project => project.status === 'not started').length,
    onHold: projects.filter(project => project.status === 'on hold').length,
  }

  const getUpcomingProjects = () => {
    return projects.filter(project => {
      if (!project.startDate) return false;
      const startDate = new Date(project.startDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return startDate >= today && startDate <= weekFromNow;
    }).slice(0, 3);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Briefcase className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-emerald-300 rounded-2xl animate-ping opacity-75"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border border-emerald-200 rounded-2xl animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome Back!</h2>
          <p className="text-gray-900 mb-8 text-lg">Loading your personalized dashboard...</p>

          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 h-full rounded-full animate-pulse"></div>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const upcomingProjects = getUpcomingProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" />
                  <span>Welcome back, {userName || 'Loading...'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Projects', 
              value: projects.length, 
              color: 'from-emerald-500 to-teal-600', 
              icon: FileText,
              change: '+12%'
            },
            { 
              label: 'Active Clients', 
              value: clients.length, 
              color: 'from-blue-500 to-blue-600', 
              icon: Users,
              change: '+8%'
            },
            { 
              label: 'In Progress', 
              value: projectStats.pending, 
              color: 'from-amber-500 to-orange-600', 
              icon: Clock,
              change: '+5%'
            },
            { 
              label: 'Completed', 
              value: projectStats.completed, 
              color: 'from-green-500 to-emerald-600', 
              icon: CheckCircle,
              change: '+15%'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Clients</h3>
                    <p className="text-sm text-gray-600">{clients.length} active clients</p>
                  </div>
                </div>
                <Link
                  href="/clients/add-client"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Manage your client relationships and track project assignments.</p>
              <Link
                href="/clients"
                className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-700 py-2.5 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                View All Clients
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Projects</h3>
                    <p className="text-sm text-gray-600">{projects.length} total projects</p>
                  </div>
                </div>
                <Link
                  href="/projects/create-project"
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Track progress and manage all your ongoing projects efficiently.</p>
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 w-full bg-emerald-50 text-emerald-700 py-2.5 px-4 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Project Overview</h3>
                <p className="text-sm text-gray-600">Current status breakdown</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Completed', value: projectStats.completed, color: 'bg-green-500', textColor: 'text-green-700' },
                { label: 'In Progress', value: projectStats.pending, color: 'bg-blue-500', textColor: 'text-blue-700' },
                { label: 'Not Started', value: projectStats.notStarted, color: 'bg-gray-400', textColor: 'text-gray-700' },
                { label: 'On Hold', value: projectStats.onHold, color: 'bg-amber-500', textColor: 'text-amber-700' }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${stat.textColor}`}>{stat.value}</span>
                    <span className="text-xs text-gray-500">
                      ({projects.length > 0 ? Math.round((stat.value / projects.length) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest updates and changes</p>
                </div>
              </div>
              {recentActivities.length > 0 && (
                <button 
                  onClick={() => router.push('/activity')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View All
                </button>
              )}
            </div>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const iconMap = {
                    project: { icon: <FileText className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
                    client: { icon: <Users className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
                    task: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' }
                  };
                  
                  return (
                    <div 
                      key={activity.id} 
                      className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                      onClick={() => router.push(`/${activity.type}s`)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconMap[activity.type].color}`}>
                        {iconMap[activity.type].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-gray-700">
                          {activity.title} was {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="text-gray-600 font-medium mb-2">No recent activity</h4>
                <p className="text-gray-500 text-sm">Start creating projects and adding clients to see activity here</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upcoming</h3>
                <p className="text-sm text-gray-600">Projects starting soon</p>
              </div>
            </div>

            {upcomingProjects.length > 0 ? (
              <div className="space-y-3">
                {upcomingProjects.map((project) => (
                  <div key={project._id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{project.client?.name || 'No client assigned'}</p>
                    <p className="text-xs text-orange-600 font-medium mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No upcoming projects this week</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}