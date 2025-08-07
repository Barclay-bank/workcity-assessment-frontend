'use client'

import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Building, 
  Mail, 
  Phone, 
  AlertTriangle, 
  UserCheck, 
  Briefcase,
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  MoreVertical,
  Star,
  Activity
} from 'lucide-react'
import Link from 'next/link'

type Client = {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  createdAt?: string
  projectsCount?: number
  status?: 'active' | 'inactive'
}

export default function ClientDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: Client | null }>({
    isOpen: false,
    client: null
  })
  
  const router = { push: (path: string) => console.log('Navigate to:', path) }

  const fetchClients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch clients')
      }

      const enhancedClients = (data || []).map((client: Client) => ({
        ...client,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        projectsCount: Math.floor(Math.random() * 8) + 1,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      }))

      setClients(enhancedClients)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (clientId: string) => {
    try {
      setDeleteLoading(clientId)
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete client')
      }

      await fetchClients()
      setDeleteModal({ isOpen: false, client: null })
    } catch (err: any) {
      setError(err.message)
      setDeleteModal({ isOpen: false, client: null })
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    companies: new Set(clients.map(c => c.company)).size,
    totalProjects: clients.reduce((sum, c) => sum + (c.projectsCount || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Users className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-emerald-300 rounded-2xl animate-ping opacity-60"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Loading Your Clients</h2>
          <p className="text-black mb-8 text-lg">Getting your client data ready...</p>

          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full rounded-full animate-pulse"></div>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Client Dashboard</h1>
                <p className="text-gray-600 mt-2 text-base">
                  Manage and nurture your client relationships
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{clientStats.total} total clients</span>
                  <span>•</span>
                  <span>{clientStats.active} active</span>
                  <span>•</span>
                  <span>{filteredClients.length} showing</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-200 hover:border-emerald-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              
              <Link
                href="/clients/add-client"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add New Client
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { 
              label: 'Total Clients', 
              value: clientStats.total, 
              color: 'from-emerald-500 to-teal-600', 
              icon: Users,
              change: '+12%'
            },
            { 
              label: 'Active Clients', 
              value: clientStats.active, 
              color: 'from-green-500 to-emerald-600', 
              icon: UserCheck,
              change: '+8%'
            },
            { 
              label: 'Companies', 
              value: clientStats.companies, 
              color: 'from-blue-500 to-blue-600', 
              icon: Building,
              change: '+5%'
            },
            { 
              label: 'Total Projects', 
              value: clientStats.totalProjects, 
              color: 'from-purple-500 to-purple-600', 
              icon: Briefcase,
              change: '+15%'
            },
            { 
              label: 'This Month', 
              value: clients.filter(c => c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, 
              color: 'from-amber-500 to-orange-600', 
              icon: Calendar,
              change: '+20%'
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
                <div className="text-sm text-gray-600 truncate">{stat.label}</div>
              </div>
            );
          })}
        </div>
        <div className='mb-[20px]'>
        {filteredClients.length > 0 && (
          <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900">{filteredClients.length}</div>
                <div className="text-sm text-gray-600 font-medium">Showing</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredClients.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(filteredClients.map(c => c.company)).size}
                </div>
                <div className="text-sm text-gray-600 font-medium">Companies</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredClients.reduce((sum, c) => sum + (c.projectsCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Projects</div>
              </div>
            </div>
          </div>
        )}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
        
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-white placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all" className='text-gray-600'>All Clients</option>
                <option value="active" className='text-gray-600'>Active Only</option>
                <option value="inactive" className='text-gray-600'>Inactive Only</option>
              </select>
              
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap">
                <Filter className="w-5 h-5" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error occurred</h3>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchClients}
              className="ml-auto px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm || filterStatus !== 'all' ? 'No clients match your criteria' : 'No clients yet'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter settings' 
                : 'Start building your client base by adding your first client'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link
                href="/clients/add-client"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Your First Client
              </Link>
            )}
          </div>
        )}

        {!loading && filteredClients.length > 0 && (
          <div className="grid gap-6">
            {filteredClients.map(client => (
              <div key={client._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-emerald-200 group">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-8 h-8 text-emerald-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                client.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                              }`}></div>
                              {client.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            {client.projectsCount && client.projectsCount > 5 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                <Star className="w-3 h-3" />
                                VIP
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="flex items-center text-gray-600 min-w-0">
                            <Mail className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                            <span className="truncate text-sm">{client.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                          <div className="flex items-center text-gray-600 min-w-0">
                            <Building className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                            <span className="truncate text-sm">{client.company}</span>
                          </div>
                          {client.projectsCount && (
                            <div className="flex items-center text-gray-600">
                              <Briefcase className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm">{client.projectsCount} project{client.projectsCount !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {client.createdAt && (
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm">Added {new Date(client.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 sm:gap-3">
                    <Link
                      href={`/clients/${client._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <Link
                      href={`/clients/edit/${client._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, client })}
                      disabled={deleteLoading === client._id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {deleteLoading === client._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}        
      </div>

      {deleteModal.isOpen && deleteModal.client && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                Are you sure you want to permanently delete{' '}
                <strong className="text-red-800">{deleteModal.client.name}</strong>{' '}
                and all associated data?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, client: null })}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.client!._id)}
                disabled={deleteLoading === deleteModal.client!._id}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading === deleteModal.client!._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Client
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}