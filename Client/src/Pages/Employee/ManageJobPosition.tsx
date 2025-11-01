import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Eye, MapPin, DollarSign, Clock } from 'lucide-react';
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

interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  experienceRange?: string;
  salary?: number;
  postedDate: string;
  statusId: number;
  statusName: string;
  requiredSkills: string[];
  preferredSkills: string[];
}

export const ManageJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/JobPositions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:7057/api/JobPositions/${selectedJob.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchJobs();
        setShowDeleteModal(false);
        setSelectedJob(null);
      } else {
        alert('Failed to delete job position');
      }
    } catch (err) {
      alert('Error deleting job position');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Manage Job Positions</h1>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Manage Job Positions</h1>
            <p className="text-lg text-gray-600">{jobs.length} job positions</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
            <Plus className="h-5 w-5" />
            Create New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No job positions yet</p>
            <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h2 className="text-2xl font-bold">{job.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(job.statusName)}`}>
                        {job.statusName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{job.employmentType}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span>₹{job.salary.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-black text-white text-sm font-semibold rounded-lg">
                        {job.experienceLevel}
                      </span>
                      {job.experienceRange && (
                        <span className="px-3 py-1 border-2 border-gray-300 text-sm font-semibold rounded-lg">
                          {job.experienceRange}+ Years
                        </span>
                      )}
                    </div>

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            +{job.requiredSkills.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-black font-semibold rounded-lg hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-black font-semibold rounded-lg hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200 text-sm text-gray-500">
                  Posted on {new Date(job.postedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Position</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedJob?.title}</strong>? This action cannot be undone and will affect all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete Job'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
