import { useEffect, useState } from 'react';
import { applicationService } from '@/Services/ApplicationService';
import { interviewService } from '@/Services/InterviewService';
import type { Application } from '@/Types/application.types';
import type { InterviewRound, InterviewFeedback } from '@/Types/interview.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/Button';
import { Calendar, Clock, Video, MapPin, Star, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';

interface InterviewsProps {
  isProfileComplete: boolean;
}

export const Interviews = ({ isProfileComplete }: InterviewsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviewsByApp, setInterviewsByApp] = useState<Record<string, InterviewRound[]>>({});
  const [feedbackByInterview, setFeedbackByInterview] = useState<Record<string, InterviewFeedback[]>>({});
  const [expandedFeedback, setExpandedFeedback] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isProfileComplete) {
      fetchInterviews();
    } else {
      setLoading(false);
    }
  }, [isProfileComplete]);

  const fetchInterviews = async () => {
    try {
      const apps = await applicationService.getMyApplications();
      setApplications(apps);

      const interviewsMap: Record<string, InterviewRound[]> = {};
      const feedbackMap: Record<string, InterviewFeedback[]> = {};

      await Promise.all(
        apps.map(async (app) => {
          try {
            const interviews = await interviewService.getInterviewsByApplication(app.applicationId);
            if (interviews.length > 0) {
              interviewsMap[app.applicationId] = interviews;

              // Fetch feedback for completed interviews
              await Promise.all(
                interviews.map(async (interview) => {
                  if (interview.scheduledDate && new Date(interview.scheduledDate) <= new Date()) {
                    try {
                      const feedback = await interviewService.getFeedbacksByInterview(interview.id);
                      if (feedback.length > 0) {
                        feedbackMap[interview.id] = feedback;
                      }
                    } catch (error) {
                      console.error(`Failed to fetch feedback for interview ${interview.id}`);
                    }
                  }
                })
              );
            }
          } catch (error) {
            console.error(`Failed to fetch interviews for application ${app.applicationId}`, error);
          }
        })
      );

      setInterviewsByApp(interviewsMap);
      setFeedbackByInterview(feedbackMap);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
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

  const toggleFeedback = (interviewId: string) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [interviewId]: !prev[interviewId]
    }));
  };

  if (!isProfileComplete) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Interviews</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Please complete your profile to view interviews.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const applicationsWithInterviews = applications.filter(
    app => interviewsByApp[app.applicationId]?.length > 0
  );

  if (applicationsWithInterviews.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Interviews</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            You don't have any scheduled interviews yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Interviews will appear here once they are scheduled for your applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">My Interviews</h2>
        <p className="text-gray-600">View your scheduled interviews and feedback</p>
      </div>

      <div className="space-y-6">
        {applicationsWithInterviews.map((application) => {
          const interviews = interviewsByApp[application.applicationId] || [];
          const upcomingInterviews = interviews.filter(
            i => i.scheduledDate && new Date(i.scheduledDate) > new Date()
          );
          const pastInterviews = interviews.filter(
            i => i.scheduledDate && new Date(i.scheduledDate) <= new Date()
          );

          return (
            <Card key={application.applicationId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Applied on {new Date(application.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {interviews.length} {interviews.length === 1 ? 'Round' : 'Rounds'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upcoming Interviews */}
                {upcomingInterviews.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Upcoming</h4>
                    <div className="space-y-3">
                      {upcomingInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 border rounded-lg bg-blue-50 border-blue-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  Round {interview.roundNumber} - {interview.roundType}
                                </span>
                                <Badge className={getStatusColor(interview.statusId)}>
                                  {interview.statusName}
                                </Badge>
                              </div>
                              {interview.roundName && (
                                <p className="text-sm text-gray-600">{interview.roundName}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
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

                          {(interview.meetingLink || interview.location) && (
                            <div className="flex gap-4 pt-3 border-t">
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
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Interviews */}
                {pastInterviews.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Completed</h4>
                    <div className="space-y-3">
                      {pastInterviews.map((interview) => {
                        const feedbacks = feedbackByInterview[interview.id] || [];
                        const hasFeedback = feedbacks.length > 0;

                        return (
                          <div
                            key={interview.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    Round {interview.roundNumber} - {interview.roundType}
                                  </span>
                                  <Badge className={getStatusColor(interview.statusId)}>
                                    {interview.statusName}
                                  </Badge>
                                </div>
                                {interview.scheduledDate && (
                                  <p className="text-sm text-gray-600">
                                    {new Date(interview.scheduledDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              {interview.averageRating && (
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Average Rating</div>
                                  <div className="font-medium text-yellow-600 flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400" />
                                    {interview.averageRating.toFixed(1)}/5
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Feedback Section */}
                            {hasFeedback && (
                              <div className="mt-3 pt-3 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFeedback(interview.id)}
                                  className="w-full justify-between"
                                >
                                  <span className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    View Feedback ({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})
                                  </span>
                                  <span>{expandedFeedback[interview.id] ? '▲' : '▼'}</span>
                                </Button>

                                {expandedFeedback[interview.id] && (
                                  <div className="mt-3 space-y-3">
                                    {feedbacks.map((feedback) => (
                                      <div
                                        key={feedback.id}
                                        className="p-3 bg-gray-50 rounded-lg space-y-2"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium">
                                              {feedback.interviewerName || 'Interviewer'}
                                            </span>
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {new Date(feedback.submittedAt).toLocaleDateString()}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                          {feedback.overallRating && (
                                            <div>
                                              <span className="text-gray-500">Overall:</span>
                                              <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{feedback.overallRating}/5</span>
                                              </div>
                                            </div>
                                          )}
                                          {feedback.technicalRating && (
                                            <div>
                                              <span className="text-gray-500">Technical:</span>
                                              <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{feedback.technicalRating}/5</span>
                                              </div>
                                            </div>
                                          )}
                                          {feedback.communicationRating && (
                                            <div>
                                              <span className="text-gray-500">Communication:</span>
                                              <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{feedback.communicationRating}/5</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {feedback.recommendation && (
                                          <div>
                                            <span className="text-xs text-gray-500">Recommendation:</span>
                                            <Badge
                                              variant="outline"
                                              className="ml-2 text-xs"
                                            >
                                              {feedback.recommendation.replace(/_/g, ' ')}
                                            </Badge>
                                          </div>
                                        )}

                                        {feedback.comments && (
                                          <div>
                                            <span className="text-xs text-gray-500">Comments:</span>
                                            <p className="text-sm text-gray-700 mt-1">
                                              {feedback.comments}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
