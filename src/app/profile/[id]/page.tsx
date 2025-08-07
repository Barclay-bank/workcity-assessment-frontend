'use client'
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Lock,
  Globe,
  Briefcase,
  Calendar,
  Link2,
  Edit3,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  company?: string;
  website?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        console.log(data.user.name)
        setProfile(data);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Unavailable</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn't load your profile information. Please try logging in again.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="bg-white/90 backdrop-blur-md border-b border-emerald-100/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href='/dashboard' 
              className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-all duration-200 group"
            >
              <div className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-emerald-100 transition-all duration-200 group-hover:scale-105">
                <ArrowLeft className="w-5 h-5 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div>
                <span className="font-semibold text-lg">Dashboard</span>
                <p className="text-xs text-gray-500 group-hover:text-emerald-500">Go back</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{formData.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-fit sticky top-24">
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-6 py-8 text-center">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative z-10">
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {getInitials(formData.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-2">{formData.name}</h1>
                  
                  {formData.role && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-emerald-50 border border-white/20">
                      <Briefcase className="w-4 h-4" />
                      {formData.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {profile.createdAt ? Math.ceil((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : '0'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Days Active</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                    <p className="text-2xl font-bold text-teal-600">100%</p>
                    <p className="text-xs text-gray-500 font-medium">Complete</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Verified</p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              {profile.createdAt && (
                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">Member since</p>
                      <p className="text-sm text-gray-500">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50/50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Information</h2>
                    <p className="text-gray-600">Your account details and personal information</p>
                  </div>
                  <button 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {success && (
                <div className="m-8 mb-0 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-800 font-medium">Profile updated successfully!</p>
                  </div>
                </div>
              )}

              {errors.form && (
                <div className="m-8 mb-0 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">{errors.form}</p>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-200 transition-all duration-200 hover:bg-gray-100">
                        {formData.name || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mr-3">
                        <Briefcase className="w-4 h-4 text-teal-600" />
                      </div>
                      Role
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-200 transition-all duration-200 hover:bg-gray-100">
                        {formData.role || 'Not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      Email Address
                      <div className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        <Lock className="w-3 h-3" />
                        Verified
                      </div>
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-gray-50 rounded-xl text-gray-800 font-medium border border-gray-200 transition-all duration-200 hover:bg-gray-100">
                        {formData.email || 'Not provided'}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    Account Security
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-emerald-800">Email Verified</p>
                          <p className="text-sm text-emerald-600">Your email is confirmed</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-800">Account Secured</p>
                          <p className="text-sm text-blue-600">Strong password protection</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}