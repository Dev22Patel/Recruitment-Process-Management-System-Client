import { useState, useEffect } from 'react';
import { FileText, Search, Filter, User, Briefcase, Calendar, Mail, Phone, Download, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../Components/ui/alert-dialog';

interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobPositionId: string;
  jobTitle: string;
  department: string;
  location: string;
  applicationDate: string;
  statusId: number;
  statusName: string;
  statusReason?: string;
  totalExperience?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  resumeFilePath?: string;
  candidateSkills?: string[];
  requiredSkills?: string[];
  matchingSkillsCount?: number;
}

export const AllApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/Application/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.statusName?.toLowerCase() === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUpdateStatus = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.statusId.toString());
    setStatusReason(app.statusReason || '');
    setShowUpdateModal(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/Application/update-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          statusId: parseInt(newStatus),
          statusReason: statusReason
        })
      });

      if (response.ok) {
        await fetchApplications();
        setShowUpdateModal(false);
        setSelectedApp(null);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">All Applications</h1>
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">All Applications</h1>
          <p className="text-lg text-gray-600">{filteredApplications.length} applications found</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by candidate name, job title, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('applied')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'applied' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Applied
            </button>
            <button
              onClick={() => setStatusFilter('screening')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'screening' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Screening
            </button>
            <button
              onClick={() => setStatusFilter('interview')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'interview' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Interview
            </button>
            <button
              onClick={() => setStatusFilter('selected')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'selected' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Selected
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{app.candidateName}</h3>
                        <p className="text-gray-600">{app.jobTitle}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{app.candidateEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span>{app.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {app.candidateSkills && app.candidateSkills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {app.candidateSkills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {skill}
                            </span>
                          ))}
                          {app.candidateSkills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              +{app.candidateSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold whitespace-nowrap ${getStatusColor(app.statusName)}`}>
                      <span className="capitalize">{app.statusName}</span>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(app)}
                      className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {app.statusReason && (
                  <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Status Note:</p>
                    <p className="text-sm text-gray-700">{app.statusReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      <AlertDialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Application Status</AlertDialogTitle>
            <AlertDialogDescription>
              Update the status for {selectedApp?.candidateName}'s application for {selectedApp?.jobTitle}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              >
                <option value="4">Applied</option>
                <option value="5">Screening</option>
                <option value="6">Interview</option>
                <option value="7">Selected</option>
                <option value="8">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status Reason/Note</label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={4}
                placeholder="Add a note about this status change (optional for most statuses, required for rejection)"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none resize-none"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitStatusUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
