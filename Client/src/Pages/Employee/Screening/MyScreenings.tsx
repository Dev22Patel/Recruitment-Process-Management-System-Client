import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Calendar, Star, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { type ScreeningReviewResponseDto } from '@/Services/ScreeningService';
import { format } from 'date-fns';

export const MyScreenings = () => {
  const [screenings, setScreenings] = useState<ScreeningReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyScreenings();
  }, []);

  const fetchMyScreenings = async () => {
    try {
      setLoading(true);
      setError(null);

      // const data = await screeningService.getMyScreenings();
      // setScreenings(data);
      setScreenings([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load screenings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your screenings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Screenings</h1>
        <p className="text-gray-600 mt-1">Review your completed screening history</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Screenings List */}
      {screenings.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No screenings found</h3>
          <p className="text-gray-600 mb-4">
            You haven't completed any screenings yet.
          </p>
          <Button onClick={() => navigate('/employee/screening/pending')}>
            View Pending Screenings
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {screenings.map((screening) => (
            <Card key={screening.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{screening.candidateName}</h3>
                      {screening.isRecommendedForInterview ? (
                        <Badge className="bg-green-100 text-green-800">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Not Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{screening.candidateEmail}</p>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {screening.jobTitle}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{screening.rating || 'N/A'} / 5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(screening.reviewDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    {screening.comments && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {screening.comments}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/employee/screening/review/${screening.applicationId}`)
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};