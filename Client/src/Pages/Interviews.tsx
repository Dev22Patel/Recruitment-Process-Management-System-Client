import { useEffect, useState } from 'react';
import { applicationService } from '@/Services/ApplicationService';
import { interviewService } from '@/Services/InterviewService';
import type { Application } from '@/Types/application.types';
import type { InterviewRound } from '@/Types/interview.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Calendar, Clock, Video, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InterviewsProps {
  isProfileComplete: boolean;
}

export const Interviews = ({ isProfileComplete }: InterviewsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviewsByApp, setInterviewsByApp] = useState<Record<string, InterviewRound[]>>({});
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

      await Promise.all(
        apps.map(async (app) => {
          try {
            const interviews = await interviewService.getInterviewsByApplication(app.applicationId);
            if (interviews.length > 0) {
              interviewsMap[app.applicationId] = interviews;
            }
          } catch (error) {
            console.error(`Failed to fetch interviews for application ${app.applicationId}`, error);
          }
        })
      );

      setInterviewsByApp(interviewsMap);
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

  const isUpcoming = (scheduledDate: string | undefined) => {
    if (!scheduledDate) return false;
    return new Date(scheduledDate) > new Date();
  };

  const hasFeedback = (interview: InterviewRound) => {
    return interview.totalFeedbacksReceived > 0;
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
        <p className="text-gray-600">View your scheduled interviews</p>
      </div>

      <div className="space-y-6">
        {applicationsWithInterviews.map((application) => {
          const interviews = interviewsByApp[application.applicationId] || [];
          const upcomingInterviews = interviews
            .filter(i => isUpcoming(i.scheduledDate))
            .sort((a, b) => {
              if (!a.scheduledDate || !b.scheduledDate) return 0;
              return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
            });

          const pastInterviews = interviews
            .filter(i => !isUpcoming(i.scheduledDate))
            .sort((a, b) => {
              if (!a.scheduledDate || !b.scheduledDate) return 0;
              return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
            });

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
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      Upcoming Interviews
                    </h4>
                    <div className="space-y-3">
                      {upcomingInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 border-2 rounded-lg bg-blue-50 border-blue-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-blue-900">
                                  Round {interview.roundNumber} - {interview.roundType}
                                </span>
                                <Badge className={getStatusColor(interview.statusId)}>
                                  {interview.statusName}
                                </Badge>
                              </div>
                              {interview.roundName && (
                                <p className="text-sm text-gray-700 font-medium">{interview.roundName}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {interview.scheduledDate && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-gray-600">Date</p>
                                    <span className="font-medium text-gray-900">
                                      {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-gray-600">Time</p>
                                    <span className="font-medium text-gray-900">
                                      {new Date(interview.scheduledDate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                      {interview.duration && (
                                        <span className="text-gray-600"> ({interview.duration} min)</span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {(interview.meetingLink || interview.location) && (
                            <div className="flex flex-col gap-2 pt-3 border-t border-blue-300">
                              {interview.meetingLink && (
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                  <Video className="h-4 w-4" />
                                  Join Meeting Link
                                </a>
                              )}
                              {interview.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <MapPin className="h-4 w-4 text-gray-600" />
                                  <span className="font-medium">{interview.location}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {interview.totalParticipants > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <p className="text-xs text-gray-600">
                                {interview.totalParticipants} {interview.totalParticipants === 1 ? 'interviewer' : 'interviewers'} assigned
                              </p>
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
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Completed Interviews
                    </h4>
                    <div className="space-y-3">
                      {pastInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 border rounded-lg bg-gray-50"
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
                                {hasFeedback(interview) && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Feedback Received
                                  </Badge>
                                )}
                              </div>
                              {interview.roundName && (
                                <p className="text-sm text-gray-600">{interview.roundName}</p>
                              )}
                            </div>
                          </div>

                          {interview.scheduledDate && (
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              {interview.duration && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{interview.duration} minutes</span>
                                </div>
                              )}
                            </div>
                          )}

                          {hasFeedback(interview) && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                  Feedback has been submitted by the interview panel
                                </p>
                                <Badge variant="outline" className="bg-green-50">
                                  {interview.totalFeedbacksReceived}/{interview.totalParticipants} Reviews
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
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
