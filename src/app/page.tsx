'use client';

import { useState, useEffect } from "react";
import { Briefcase, Users, TrendingUp, FolderOpen, Clock, Bell, Settings, Search, Calendar, BarChart3, UserCircle, Folder, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Active Projects", value: "24", icon: Folder, change: "+5", trend: "up" },
    { label: "Total Clients", value: "18", icon: Users, change: "+3", trend: "up" },
    { label: "Success Rate", value: "96%", icon: TrendingUp, change: "+2%", trend: "up" },
    { label: "In Progress", value: "12", icon: FolderOpen, change: "+4", trend: "up" }
  ];

  const recentActivities = [
    { action: "New project created for TechCorp", department: "Development", time: "2 hours ago" },
    { action: "Client meeting scheduled", department: "Business Dev", time: "4 hours ago" },
    { action: "Project milestone completed", department: "Design", time: "6 hours ago" }
  ];

  const upcomingEvents = [
    { title: "Client Presentation - Alpha Inc", time: "Tomorrow 10:00 AM", type: "meeting" },
    { title: "Project Deadline - Beta Solutions", time: "Next Week", type: "deadline" },
    { title: "Team Review Meeting", time: "Friday 3:00 PM", type: "review" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">ProjectFlow</h1>
                  <p className="text-sm text-gray-500">Client Project Management Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className='curdor-pointer'>
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 cursor-pointer text-gray-600 hover:text-emerald-600 transition-colors"
                    
                  >

                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  </Link>
                  
                  <Link href="/signup" >
                  <button 
                    className="flex items-center space-x-2 bg-gradient-to-r cursor-pointer from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                    
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search projects..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="relative">
                    <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors" />
                    {notifications > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </div>
                  
                  <UserCircle className="w-8 h-8 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors" />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {isLoggedIn ? "Welcome back to ProjectFlow!" : "Welcome to ProjectFlow!"}
                  </h2>
                  <p className="text-slate-300 text-lg mb-4">
                    Streamline client projects from concept to completion
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentTime.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{currentTime.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {!isLoggedIn && (
                    <div className="mt-4">
                      <button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-all shadow-sm"
                        onClick={() => setIsLoggedIn(true)}
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <Folder className="w-12 h-12 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-emerald-100 text-emerald-600' :
                  index === 1 ? 'bg-teal-100 text-teal-600' :
                  index === 2 ? 'bg-slate-100 text-slate-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
              About ProjectFlow
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                ProjectFlow is a comprehensive project management platform designed specifically for agencies 
                and service providers who create custom projects for clients. We streamline the entire project 
                lifecycle from initial consultation to final delivery, ensuring exceptional client satisfaction.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-600">
                    To empower creative professionals with tools that turn client visions into successful project outcomes.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Founded</h4>
                  <p className="text-sm text-gray-600">
                    2021 • Headquartered in Austin, TX
                  </p>
                </div>
              </div>
              
              {!isLoggedIn && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2">Start Managing Projects Today</h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Join hundreds of agencies already using ProjectFlow to deliver exceptional client projects.
                  </p>
                  <div className="flex space-x-3">
                 
                    <button 
                      className="border border-emerald-600 cursor-pointer text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => alert('Navigate to Learn More page')}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              {isLoggedIn ? "Upcoming Deadlines" : "Latest Features"}
            </h3>
            <div className="space-y-3">
              {isLoggedIn ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.type === 'meeting' ? 'bg-emerald-500' :
                      event.type === 'deadline' ? 'bg-amber-500' :
                      'bg-teal-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-gray-500 text-xs">{event.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="font-medium text-emerald-900 text-sm">Client Portal Integration</p>
                    <p className="text-emerald-700 text-xs">Give clients real-time project visibility</p>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                    <p className="font-medium text-teal-900 text-sm">Time Tracking & Billing</p>
                    <p className="text-teal-700 text-xs">Automated invoicing for project work</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-medium text-slate-900 text-sm">Advanced Analytics</p>
                    <p className="text-slate-700 text-xs">Project profitability insights</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
              {isLoggedIn ? "Recent Activity" : "Platform Capabilities"}
            </h3>
            {isLoggedIn && (
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View All
              </button>
            )}
          </div>
          <div className="space-y-4">
            {isLoggedIn ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Folder className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.department}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Creation</h4>
                  <p className="text-sm text-gray-600">Create detailed project scopes, timelines, and deliverables for each client.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Client Collaboration</h4>
                  <p className="text-sm text-gray-600">Keep clients engaged with progress updates and collaborative workspaces.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Tracking</h4>
                  <p className="text-sm text-gray-600">Monitor project profitability and team productivity with detailed analytics.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        
        {!isLoggedIn && (
          <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Streamline Your Client Projects?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of agencies and freelancers using ProjectFlow to deliver exceptional client work on time and on budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                onClick={() => alert('Navigate to Sign Up page')}
              >
                Get Started
              </button>
              <button 
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                onClick={() => alert('Schedule a demo')}
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}