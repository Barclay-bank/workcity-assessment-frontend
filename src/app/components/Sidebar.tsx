'use client'

import { 
  Users, 
  Briefcase, 
  Menu, 
  X, 
  Home,
  User,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'



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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState('')
const [userName, setUserName] = useState<string | null>(null)
const [userId, setUserId] = useState<string | null>(null)
    
    
   

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
          console.log(userData)
          setUserName(userData.user?.name || userData.name)
            setUserId(userData.user?._id || userData._id)
  
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
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
          console.error('Error:', err)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchData()
    }, [router])
  

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Plus, label: 'Add Client', path: '/clients/add-client' },
    { icon: Briefcase, label: 'Projects', path: '/projects', },
    { icon: Briefcase, label: 'Create Project', path: '/projects/create-project', },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div 
      className={`bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex-shrink-0 h-screen sticky top-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <h1 
              className="text-xl font-bold text-gray-900 whitespace-nowrap cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              ProjectFlow
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative group ${
                item.active
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              
              <span 
                className={`font-medium whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                }`}
              >
                {item.label}
              </span>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
    <Link 
          href={`/profile/${userId}`}
          className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors relative group`}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <p className="font-medium text-gray-900 whitespace-nowrap">{userName || 'Loading...'}</p>
          </div>

          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-gray-300">john@company.com</div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;