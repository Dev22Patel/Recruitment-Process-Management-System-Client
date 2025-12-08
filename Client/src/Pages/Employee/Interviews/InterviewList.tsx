import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '@/Services/InterviewService';
import type { InterviewRound } from '@/Types/interview.types';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Search, Calendar, Video, MapPin, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

const InterviewList = () => {
  const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<InterviewRound[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    let filtered = interviews;

    if (searchTerm) {
      filtered = filtered.filter(interview =>
        interview.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(interview => interview.statusId === parseInt(statusFilter));
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(interview => interview.roundType === typeFilter);
    }

    setFilteredInterviews(filtered);
  }, [searchTerm, statusFilter, typeFilter, interviews]);

  const fetchInterviews = async () => {
    try {
      const data = await interviewService.getAllInterviews();
      setInterviews(data);
      setFilteredInterviews(data);
    } catch (error) {
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

  const getRoundTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'HR': return 'bg-blue-100 text-blue-800';
      case 'Panel': return 'bg-orange-100 text-orange-800';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage candidate interviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by candidate or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="9">Scheduled</SelectItem>
            <SelectItem value="10">Completed</SelectItem>
            <SelectItem value="11">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Panel">Panel</SelectItem>
            <SelectItem value="Managerial">Managerial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No interviews found</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Schedule interviews from application details'}
          </p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Showing {filteredInterviews.length} of {interviews.length} interviews
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredInterviews.map((interview) => (
              <Card
                key={interview.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/employee/interviews/${interview.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                        <Badge className={getRoundTypeColor(interview.roundType)}>
                          Round {interview.roundNumber} - {interview.roundType}
                        </Badge>
                        <Badge className={getStatusColor(interview.statusId)}>
                          {interview.statusName}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{interview.jobTitle}</p>
                      {interview.roundName && (
                        <p className="text-sm text-gray-500 mt-1">{interview.roundName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {interview.scheduledDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Date & Time</p>
                          <p className="font-medium">
                            {new Date(interview.scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(interview.scheduledDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {interview.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">{interview.duration} min</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Participants</p>
                        <p className="font-medium">{interview.totalParticipants}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Feedback</p>
                        <p className="font-medium">
                          {interview.totalFeedbacksReceived}/{interview.totalParticipants}
                        </p>
                        {interview.averageRating && (
                          <p className="text-xs text-yellow-600">
                            ⭐ {interview.averageRating.toFixed(1)}/5
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {(interview.meetingLink || interview.location) && (
                    <div className="mt-4 pt-4 border-t flex gap-4">
                      {interview.meetingLink && (
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="h-4 w-4 text-blue-600" />
                            <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                      {interview.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{interview.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewList;
