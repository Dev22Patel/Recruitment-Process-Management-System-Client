import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Calendar,
  Mail,
  Star,
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { SkillVerificationForm } from '@/Components/Screening/SkillVerificationForm';
import screeningService, {
  type PendingScreeningResponseDto,
  type SkillVerificationDto,
  type ScreeningReviewResponseDto,
} from '@/Services/ScreeningService';
import { format } from 'date-fns';

export const ScreeningDetails = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<PendingScreeningResponseDto | null>(null);
  const [existingScreening, setExistingScreening] = useState<ScreeningReviewResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState<number>(3);
  const [comments, setComments] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [verifiedSkills, setVerifiedSkills] = useState<SkillVerificationDto[]>([]);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending screenings to get application details
      const pendingScreenings = await screeningService.getPendingScreenings();
      const currentApp = pendingScreenings.find((s) => s.applicationId === applicationId);

      if (!currentApp) {
        setError('Application not found');
        setLoading(false);
        return;
      }

      setApplication(currentApp);

      // Check if screening already exists
      try {
        const existingScreenings = await screeningService.getScreeningsByApplication(applicationId!);
        if (existingScreenings && existingScreenings.length > 0) {
          const existing = existingScreenings[0];
          setExistingScreening(existing);
          setRating(existing.rating || 3);
          setComments(existing.comments || '');
          setIsRecommended(existing.isRecommendedForInterview);
          setVerifiedSkills(existing.verifiedSkills || []);
        }
      } catch (err) {
        // No existing screening found, that's ok
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (recommendForInterview: boolean) => {
    try {
      setSubmitting(true);
      setError(null);

      if (existingScreening) {
        // Update existing screening
        await screeningService.updateScreeningReview({
          screeningReviewId: existingScreening.id,
          rating,
          comments,
          isRecommendedForInterview: recommendForInterview,
          verifiedSkills,
        });
      } else {
        // Create new screening
        await screeningService.createScreeningReview({
          applicationId: applicationId!,
          rating,
          comments,
          isRecommendedForInterview: recommendForInterview,
          verifiedSkills,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/employee/screening/pending');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit screening review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Application not found</h3>
        <Button onClick={() => navigate('/employee/screening/pending')}>
          Back to Pending Screenings
        </Button>
      </div>
    );
  }

  const matchPercentage =
    application.requiredSkills > 0
      ? Math.round((application.matchingSkills / application.requiredSkills) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/employee/screening/pending')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pending Screenings
        </Button>
        {application.hasBeenScreenedBefore && (
          <Badge variant="secondary">Previously Screened</Badge>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Screening review submitted successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Candidate Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{application.candidateName || 'Unknown'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="font-medium text-sm break-all">{application.candidateEmail}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Briefcase className="h-4 w-4" />
                  Current Company
                </div>
                <p className="font-medium">{application.currentCompany || 'N/A'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  Total Experience
                </div>
                <p className="font-medium">{application.totalExperience || 0} years</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  Application Date
                </div>
                <p className="font-medium">
                  {format(new Date(application.applicationDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job Position Card */}
          <Card>
            <CardHeader>
              <CardTitle>Position Applied For</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg">{application.jobTitle}</p>
            </CardContent>
          </Card>

          {/* Skills Match Card */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{matchPercentage}%</div>
                <p className="text-sm text-gray-600 mb-4">Overall Match</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {application.matchingSkills}
                    </p>
                    <p className="text-xs text-gray-600">Matching</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {application.requiredSkills}
                    </p>
                    <p className="text-xs text-gray-600">Required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Card */}
          {application.resumeFilePath && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(application.resumeFilePath, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Screening Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rating Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-lg font-medium">{rating} / 5</span>
              </div>
            </CardContent>
          </Card>

          {/* Skills Verification */}
          {application.candidateSkills && application.candidateSkills.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <SkillVerificationForm
                  skills={application.candidateSkills}
                  verifiedSkills={verifiedSkills}
                  onChange={setVerifiedSkills}
                />
              </CardContent>
            </Card>
          )}

          {/* Comments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Screening Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your screening notes and observations here..."
                rows={6}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={() => handleSubmit(false)}
              disabled={submitting || success}
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              {submitting ? 'Submitting...' : 'Reject'}
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleSubmit(true)}
              disabled={submitting || success}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              {submitting ? 'Submitting...' : 'Recommend for Interview'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};