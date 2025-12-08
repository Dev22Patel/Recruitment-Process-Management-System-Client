import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '@/Services/InterviewService';
import type { InterviewRound } from '@/Types/interview.types';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Calendar, Clock, Video, MapPin, Users, Mail, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const InterviewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInterview();
    }
  }, [id]);

  const fetchInterview = async () => {
    try {
      const data = await interviewService.getInterviewById(id!);
      setInterview(data);
    } catch (error) {
      toast.error('Failed to fetch interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await interviewService.deleteInterview(id!);
      toast.success('Interview deleted successfully');
      navigate('/employee/interviews');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete interview');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 9: return 'bg-blue-100 text-blue-800';
      case 10: return 'bg-green-100 text-green-800';
      case 11: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoundTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'HR': return 'bg-blue-100 text-blue-800';
      case 'Panel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (statusId: number) => {
    switch (statusId) {
      case 12: return 'bg-green-100 text-green-800'; // Present
      case 13: return 'bg-red-100 text-red-800'; // Absent
      case 14: return 'bg-yellow-100 text-yellow-800'; // Pending
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Interview not found</h3>
        <Button className="mt-4" onClick={() => navigate('/employee/interviews')}>
          Back to Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/employee/interviews')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{interview.candidateName}</h1>
              <Badge className={getStatusColor(interview.statusId)}>
                {interview.statusName}
              </Badge>
            </div>
            <p className="text-gray-600">
              {interview.jobTitle} - Round {interview.roundNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Information</CardTitle>
                <Badge className={getRoundTypeColor(interview.roundType)}>
                  {interview.roundType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview.roundName && (
                <div>
                  <p className="text-sm text-gray-500">Round Name</p>
                  <p className="font-medium text-lg">{interview.roundName}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {interview.scheduledDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(interview.scheduledDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {interview.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{interview.duration} minutes</p>
                    </div>
                  </div>
                )}
              </div>

              {interview.meetingLink && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Video className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Meeting Link</p>
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium break-all"
                    >
                      {interview.meetingLink}
                    </a>
                  </div>
                </div>
              )}

              {interview.location && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{interview.location}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Interview Panel ({interview.participants?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interview.participants && interview.participants.length > 0 ? (
                <div className="space-y-3">
                  {interview.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {participant.userName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{participant.userName || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{participant.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {participant.participantType.replace('_', ' ')}
                        </Badge>
                        <Badge className={getAttendanceColor(participant.attendanceStatusId)}>
                          {participant.attendanceStatusName}
                        </Badge>
                        {participant.hasSubmittedFeedback && (
                          <Badge variant="outline" className="bg-green-50">
                            Feedback ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No participants added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          {interview.feedbacks && interview.feedbacks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Feedback ({interview.feedbacks.length})
                  {interview.averageRating && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                      ⭐ {interview.averageRating.toFixed(1)}/5
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interview.feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{feedback.interviewerName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(feedback.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {feedback.overallRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{feedback.overallRating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {feedback.technicalRating && (
                          <div>
                            <p className="text-xs text-gray-500">Technical</p>
                            <p className="text-sm font-medium">⭐ {feedback.technicalRating}/5</p>
                          </div>
                        )}
                        {feedback.communicationRating && (
                          <div>
                            <p className="text-xs text-gray-500">Communication</p>
                            <p className="text-sm font-medium">⭐ {feedback.communicationRating}/5</p>
                          </div>
                        )}
                      </div>

                      {feedback.recommendation && (
                        <div className="mb-2">
                          <Badge
                            className={
                              feedback.recommendation === 'Strongly_Recommend'
                                ? 'bg-green-100 text-green-800'
                                : feedback.recommendation === 'Recommend'
                                ? 'bg-blue-100 text-blue-800'
                                : feedback.recommendation === 'Maybe'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {feedback.recommendation.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}

                      {feedback.comments && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">{feedback.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{interview.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${interview.candidateEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {interview.candidateEmail}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{interview.jobTitle}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Feedback Received</span>
                <span className="font-medium">
                  {interview.totalFeedbacksReceived}/{interview.totalParticipants}
                </span>
              </div>
              {interview.averageRating && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Average Rating</span>
                  <span className="font-medium text-yellow-600">
                    ⭐ {interview.averageRating.toFixed(1)}/5
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Round Number</span>
                <span className="font-medium">{interview.roundNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/employee/applications/${interview.applicationId}`)}
              >
                View Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
