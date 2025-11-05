import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobPositionService } from '@/Services/JobPositionService';
import type { JobPosition } from '@/types/job.types';
import JobPositionCard from '@/Components/Employee/JobPositionCard';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Briefcase, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const JobPositionsList = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const data = await jobPositionService.getAllJobPositions();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      toast.error('Failed to fetch job positions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job position?')) return;

    try {
      await jobPositionService.deleteJobPosition(id);
      toast.success('Job position deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job position');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Positions</h1>
          <p className="text-gray-600 mt-1">Manage all job openings</p>
        </div>
        <Button onClick={() => navigate('/employee/jobs/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job Position
        </Button>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, department, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Job Positions Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No job positions found</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm ? 'Try adjusting your search' : 'Create your first job position to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobPositionCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPositionsList;
