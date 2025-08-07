'use client'
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import { 
  User, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  RefreshCw,
  Home
} from 'lucide-react';
import Link from "next/link";
import ClientForm from '../../../components/ClientForm';

interface ClientData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

const EditClientPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setError('Client ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Client not found");
          } else if (res.status === 401) {
            throw new Error("Unauthorized access");
          } else {
            throw new Error("Failed to fetch client data");
          }
        }

        const data = await res.json();
        setClientData(data);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError(err instanceof Error ? err.message : 'Failed to load client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch client data");
        }

        const data = await res.json();
        setClientData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load client');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  };

  if (loading && !clientData) {
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Client Data</h2>
            <p className="text-gray-600">Please wait while we fetch the client information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
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

  if (!clientData) {
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
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
        <title>Edit Client - {clientData.name}</title>
        <meta name="description" content={`Edit client information for ${clientData.name}`} />
      </Head>
      <ClientForm 
        initialData={clientData} 
        isEditMode={true} 
      />
    </>
  );
};

export default EditClientPage;