import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '@/Services/InterviewService';
import { applicationService } from '@/Services/ApplicationService';
import type { CreateInterviewRoundDto, InterviewParticipantDto } from '@/Types/interview.types';
import type { Application } from '@/Types/application.types';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Interviewer {
  id: string;
  name: string;
  email: string;
}

const ScheduleInterview = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);

  const [formData, setFormData] = useState<CreateInterviewRoundDto>({
    applicationId: applicationId || '',
    roundNumber: 1,
    roundType: 'Technical',
    roundName: '',
    scheduledDate: '',
    duration: 60,
    meetingLink: '',
    location: '',
    statusId: 9, // Scheduled
    participants: []
  });

  const [selectedParticipant, setSelectedParticipant] = useState({
    userId: '',
    participantType: 'Primary_Interviewer',
    attendanceStatusId: 14 // Pending
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
      fetchInterviewers();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getApplicationById(applicationId!);
      setApplication(data);

      // Get existing rounds to suggest next round number
      const existingInterviews = await interviewService.getInterviewsByApplication(applicationId!);
      if (existingInterviews.length > 0) {
        const maxRound = Math.max(...existingInterviews.map(i => i.roundNumber));
        setFormData(prev => ({ ...prev, roundNumber: maxRound + 1 }));
      }
    } catch (error) {
      toast.error('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewers = async () => {
    try {
      // Temporary mock data - replace with actual API call
      setInterviewers([
        { id: '6BE7473C-107B-442B-9B79-B42C2EC4FCC9', name: 'John Doe', email: 'pdev93286@gmail.com' },
    ]);

    } catch (error) {
      console.error('Failed to fetch interviewers');
    }
  };

  const handleAddParticipant = () => {
    if (!selectedParticipant.userId) {
      toast.error('Please select an interviewer');
      return;
    }

    const alreadyAdded = formData.participants?.some(p => p.userId === selectedParticipant.userId);
    if (alreadyAdded) {
      toast.error('This interviewer is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      participants: [...(prev.participants || []), selectedParticipant]
    }));

    setSelectedParticipant({
      userId: '',
      participantType: 'Primary_Interviewer',
      attendanceStatusId: 14
    });
  };

  const handleRemoveParticipant = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.userId !== userId) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.participants || formData.participants.length === 0) {
      toast.error('Please add at least one interviewer');
      return;
    }

    if (!formData.scheduledDate) {
      toast.error('Please select a date and time');
      return;
    }

    setSubmitting(true);

    try {
      // Format the data to ensure it matches backend expectations
      const submitData: CreateInterviewRoundDto = {
        applicationId: formData.applicationId,
        roundNumber: Number(formData.roundNumber),
        roundType: formData.roundType,
        roundName: formData.roundName || undefined,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : undefined,
        duration: Number(formData.duration) || undefined,
        meetingLink: formData.meetingLink || undefined,
        location: formData.location || undefined,
        statusId: Number(formData.statusId),
        participants: formData.participants.map(p => ({
          userId: p.userId,
          participantType: p.participantType,
          attendanceStatusId: Number(p.attendanceStatusId)
        }))
      };

      console.log('Submitting interview data:', submitData); // Debug log

      const result = await interviewService.scheduleInterview(submitData);
      toast.success(result.message);
      navigate(`/employee/interviews/${result.interviewRound.id}`);
    } catch (error: any) {
      console.error('Submit error:', error); // Debug log

      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;

        if (errorData.errors) {
          // ModelState validation errors
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          toast.error(`Validation error: ${errorMessages}`);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Invalid data submitted. Please check all fields.');
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to schedule interview');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
        <Button className="mt-4" onClick={() => navigate('/employee/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/employee/applications/${applicationId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
          <p className="text-gray-600 mt-1">
            {application.candidateName} - {application.jobTitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roundNumber">Round Number *</Label>
                  <Input
                    id="roundNumber"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.roundNumber}
                    onChange={(e) => setFormData({ ...formData, roundNumber: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roundType">Round Type *</Label>
                  <Select
                    value={formData.roundType}
                    onValueChange={(value) => setFormData({ ...formData, roundType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Panel">Panel</SelectItem>
                      <SelectItem value="Managerial">Managerial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roundName">Round Name (Optional)</Label>
                <Input
                  id="roundName"
                  value={formData.roundName}
                  onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                  placeholder="e.g., System Design Interview"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Date & Time *</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                    min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional - for in-person interviews)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Conference Room A, 3rd Floor"
                />
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Add Interviewers *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Select Interviewer</Label>
                  <Select
                    value={selectedParticipant.userId}
                    onValueChange={(value) => setSelectedParticipant({ ...selectedParticipant, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewers.map((interviewer) => (
                        <SelectItem key={interviewer.id} value={interviewer.id}>
                          {interviewer.name} ({interviewer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48 space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={selectedParticipant.participantType}
                    onValueChange={(value) => setSelectedParticipant({ ...selectedParticipant, participantType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary_Interviewer">Primary</SelectItem>
                      <SelectItem value="Co_Interviewer">Co-Interviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="button" onClick={handleAddParticipant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {formData.participants && formData.participants.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Interviewers ({formData.participants.length})</Label>
                  <div className="space-y-2">
                    {formData.participants.map((participant) => {
                      const interviewer = interviewers.find(i => i.id === participant.userId);
                      return (
                        <div
                          key={participant.userId}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                        >
                          <div>
                            <p className="font-medium">{interviewer?.name}</p>
                            <p className="text-sm text-gray-500">
                              {participant.participantType.replace('_', ' ')}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveParticipant(participant.userId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(!formData.participants || formData.participants.length === 0) && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Please add at least one interviewer before scheduling
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{application.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm break-all">{application.candidateEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{application.totalExperience || 0} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied For</p>
                <p className="font-medium">{application.jobTitle}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Round:</span>
                <span className="font-medium">{formData.roundNumber} - {formData.roundType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{formData.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Interviewers:</span>
                <span className="font-medium">{formData.participants?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !formData.participants || formData.participants.length === 0}
          >
            {submitting ? 'Scheduling...' : 'Schedule Interview'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/employee/applications/${applicationId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterview;
