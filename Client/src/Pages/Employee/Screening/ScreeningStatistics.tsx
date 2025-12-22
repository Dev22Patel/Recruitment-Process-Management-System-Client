import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, Star, Users } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import screeningService, {type ScreeningStatisticsDto } from '@/Services/ScreeningService';

export const ScreeningStatistics = () => {
  const [statistics, setStatistics] = useState<ScreeningStatisticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await screeningService.getScreeningStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Screening Statistics</h1>
          <p className="text-gray-600 mt-1">Overview of your screening activity</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/employee/screening/pending')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Screenings
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {statistics.totalPendingScreenings}
            </div>
            <p className="text-xs text-gray-600 mt-1">Applications awaiting review</p>
          </CardContent>
        </Card>

        {/* Total Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Screenings
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {statistics.totalCompletedScreenings}
            </div>
            <p className="text-xs text-gray-600 mt-1">Total reviews completed</p>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {statistics.approvedCount}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Recommended for interview
            </p>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {statistics.rejectedCount}
            </div>
            <p className="text-xs text-gray-600 mt-1">Not recommended</p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {statistics.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Out of 5.0</p>
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approval Rate
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {statistics.approvalRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Of completed screenings</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Screening Activity</h4>
              <p className="text-sm text-blue-700">
                You have completed {statistics.totalCompletedScreenings} screenings with{' '}
                {statistics.totalPendingScreenings} still pending review.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Recommendation Rate</h4>
              <p className="text-sm text-green-700">
                {statistics.approvalRate.toFixed(1)}% of your screenings resulted in
                interview recommendations ({statistics.approvedCount} out of{' '}
                {statistics.totalCompletedScreenings}).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};