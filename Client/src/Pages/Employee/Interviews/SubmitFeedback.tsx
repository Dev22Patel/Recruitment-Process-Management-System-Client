import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '@/Services/InterviewService';
import type { InterviewRound, CreateInterviewFeedbackDto } from '@/Types/interview.types';
import { Button } from '@/Components/ui/Button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

const SubmitFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateInterviewFeedbackDto>({
    interviewRoundId: id || '',
    overallRating: undefined,
    technicalRating: undefined,
    communicationRating: undefined,
    comments: '',
    recommendation: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.overallRating) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (!formData.recommendation) {
      toast.error('Please provide a recommendation');
      return;
    }

    setSubmitting(true);
    try {
      const result = await interviewService.submitFeedback(formData);
      toast.success(result.message);
      navigate('/employee/my-interviews');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
    label
  }: {
    value: number | undefined;
    onChange: (value: number) => void;
    label: string;
  }) => {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  value && value >= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {value && (
            <span className="ml-2 text-sm text-gray-600 self-center">
              {value}/5
            </span>
          )}
        </div>
      </div>
    );
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
        <Button className="mt-4" onClick={() => navigate('/employee/my-interviews')}>
          Back to My Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/employee/my-interviews')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Interview Feedback</h1>
          <p className="text-gray-600 mt-1">
            {interview.candidateName} - {interview.jobTitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Interview Info */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Candidate</p>
              <p className="font-medium">{interview.candidateName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="font-medium">{interview.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Round</p>
              <p className="font-medium">
                Round {interview.roundNumber} - {interview.roundType}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {interview.scheduledDate
                  ? new Date(interview.scheduledDate).toLocaleDateString()
                  : 'Not scheduled'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StarRating
              label="Overall Rating *"
              value={formData.overallRating}
              onChange={(value) => setFormData({ ...formData, overallRating: value })}
            />

            <StarRating
              label="Technical Skills"
              value={formData.technicalRating}
              onChange={(value) => setFormData({ ...formData, technicalRating: value })}
            />

            <StarRating
              label="Communication Skills"
              value={formData.communicationRating}
              onChange={(value) => setFormData({ ...formData, communicationRating: value })}
            />
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                rows={6}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Share your detailed observations about the candidate's performance, strengths, areas for improvement, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendation *</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.recommendation}
              onValueChange={(value) => setFormData({ ...formData, recommendation: value })}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Strongly_Recommend" id="strongly-recommend" />
                  <Label htmlFor="strongly-recommend" className="flex-1 cursor-pointer">
                    <div className="font-medium">Strongly Recommend</div>
                    <div className="text-sm text-gray-500">
                      Exceptional candidate, should proceed to next round
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Recommend" id="recommend" />
                  <Label htmlFor="recommend" className="flex-1 cursor-pointer">
                    <div className="font-medium">Recommend</div>
                    <div className="text-sm text-gray-500">
                      Good candidate, meets requirements
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Maybe" id="maybe" />
                  <Label htmlFor="maybe" className="flex-1 cursor-pointer">
                    <div className="font-medium">Maybe</div>
                    <div className="text-sm text-gray-500">
                      Borderline, requires further evaluation
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Do_Not_Recommend" id="not-recommend" />
                  <Label htmlFor="not-recommend" className="flex-1 cursor-pointer">
                    <div className="font-medium">Do Not Recommend</div>
                    <div className="text-sm text-gray-500">
                      Does not meet requirements for this position
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/employee/my-interviews')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitFeedback;
