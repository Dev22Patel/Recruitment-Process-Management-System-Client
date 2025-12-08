import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '@/Services/InterviewService';
import type { InterviewerSchedule } from '@/Types/interview.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/Button';
import { Calendar, Clock, Video, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyInterviews = () => {
  const [schedule, setSchedule] = useState<InterviewerSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await interviewService.getMySchedule();
      console.log('My schedule:', data);
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to fetch your interview schedule');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (scheduledDate: string | undefined) => {
    if (!scheduledDate) return 'bg-gray-100 text-gray-800';
    const isPast = new Date(scheduledDate) <= new Date();
    return isPast ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcomingInterviews = schedule.filter(
    s => s.scheduledDate && new Date(s.scheduledDate) > new Date()
  );

  const pastInterviews = schedule.filter(
    s => s.scheduledDate && new Date(s.scheduledDate) <= new Date()
  );

  if (schedule.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Interviews</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            You haven't been assigned to any interviews yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Interviews you're assigned to will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">My Interviews</h2>
        <p className="text-gray-600">Interviews where you are a participant</p>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
          <div className="grid gap-4">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.interviewRoundId} className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {interview.candidateName || 'Candidate'}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {interview.jobTitle}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {interview.participantType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-700">
                        Round {interview.roundNumber} - {interview.roundType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {interview.scheduledDate && (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>
                              {new Date(interview.scheduledDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {interview.duration && ` (${interview.duration} min)`}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3 pt-3 border-t">
                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </a>
                      )}
                      {interview.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {interview.location}
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employee/interviews/${interview.interviewRoundId}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Completed Interviews</h3>
          <div className="grid gap-4">
            {pastInterviews.map((interview) => (
              <Card key={interview.interviewRoundId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {interview.candidateName || 'Candidate'}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {interview.jobTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {interview.participantType}
                      </Badge>
                      {interview.hasSubmittedFeedback && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Feedback Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-700">
                        Round {interview.roundNumber} - {interview.roundType}
                      </span>
                    </div>

                    {interview.scheduledDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employee/interviews/${interview.interviewRoundId}`)}
                      >
                        View Details
                      </Button>
                      {!interview.hasSubmittedFeedback && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/employee/interviews/${interview.interviewRoundId}/feedback`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Submit Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
