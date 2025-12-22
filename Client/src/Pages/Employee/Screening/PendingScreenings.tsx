import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ScreeningCard } from '@/Components/Screening/ScreeningCard';
import { ScreeningFilters } from '@/Components/Screening/ScreeningFilters';
import screeningService, {type PendingScreeningResponseDto } from '@/Services/ScreeningService';

export const PendingScreenings = () => {
  const [screenings, setScreenings] = useState<PendingScreeningResponseDto[]>([]);
  const [filteredScreenings, setFilteredScreenings] = useState<PendingScreeningResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterByMatch, setFilterByMatch] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingScreenings();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [screenings, searchTerm, sortBy, filterByMatch]);

  const fetchPendingScreenings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pending screenings...');
      const data = await screeningService.getPendingScreenings();
      setScreenings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending screenings');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...screenings];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.candidateName?.toLowerCase().includes(term) ||
          s.candidateEmail?.toLowerCase().includes(term) ||
          s.jobTitle?.toLowerCase().includes(term)
      );
    }

    // Apply match filter
    if (filterByMatch !== 'all') {
      filtered = filtered.filter((s) => {
        const matchPercentage = s.requiredSkills > 0 ? (s.matchingSkills / s.requiredSkills) * 100 : 0;
        if (filterByMatch === 'high') return matchPercentage >= 80;
        if (filterByMatch === 'medium') return matchPercentage >= 50 && matchPercentage < 80;
        if (filterByMatch === 'low') return matchPercentage < 50;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        case 'date-asc':
          return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
        case 'match-desc':
          return (b.matchingSkills / b.requiredSkills || 0) - (a.matchingSkills / a.requiredSkills || 0);
        case 'match-asc':
          return (a.matchingSkills / a.requiredSkills || 0) - (b.matchingSkills / b.requiredSkills || 0);
        case 'experience-desc':
          return (b.totalExperience || 0) - (a.totalExperience || 0);
        case 'experience-asc':
          return (a.totalExperience || 0) - (b.totalExperience || 0);
        default:
          return 0;
      }
    });

    setFilteredScreenings(filtered);
  };

  const handleReviewApplication = (applicationId: string) => {
    navigate(`/employee/screening/review/${applicationId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending screenings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Screenings</h1>
          <p className="text-gray-600 mt-1">Review and screen candidate applications</p>
        </div>
        <Button onClick={() => navigate('/employee/screening/statistics')}>
          <ClipboardList className="h-4 w-4 mr-2" />
          View Statistics
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <ScreeningFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterByMatch={filterByMatch}
        onFilterByMatchChange={setFilterByMatch}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Total Pending</p>
          <p className="text-2xl font-bold text-gray-900">{screenings.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">High Match (80%+)</p>
          <p className="text-2xl font-bold text-green-600">
            {screenings.filter((s) => (s.matchingSkills / s.requiredSkills) * 100 >= 80).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Filtered Results</p>
          <p className="text-2xl font-bold text-blue-600">{filteredScreenings.length}</p>
        </div>
      </div>

      {/* Screenings Grid */}
      {filteredScreenings.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending screenings</h3>
          <p className="text-gray-600">
            {screenings.length === 0
              ? 'There are no applications pending your review at the moment.'
              : 'No screenings match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScreenings.map((screening) => (
            <ScreeningCard
              key={screening.applicationId}
              screening={screening}
              onReview={handleReviewApplication}
            />
          ))}
        </div>
      )}
    </div>
  );
};