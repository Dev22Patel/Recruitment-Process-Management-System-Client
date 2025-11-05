import { useEffect, useState } from 'react';
import { applicationService } from '@/Services/ApplicationService';
import type { Application } from '@/types/application.types';
import ApplicationCard from '@/Components/Employee/ApplicationCard';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Filter, FileText } from 'lucide-react';
import { toast } from 'sonner';

const AllApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.statusId === parseInt(statusFilter));
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getAllApplications();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by candidate name, email, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="4">Applied</SelectItem>
            <SelectItem value="5">Screening</SelectItem>
            <SelectItem value="6">Interview</SelectItem>
            <SelectItem value="7">Selected</SelectItem>
            <SelectItem value="8">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Applications will appear here once candidates apply'}
          </p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllApplications;
