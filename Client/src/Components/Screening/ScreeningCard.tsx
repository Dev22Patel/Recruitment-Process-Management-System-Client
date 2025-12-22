import { Calendar, User, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import type { PendingScreeningResponseDto } from '@/Services/ScreeningService';
import { format } from 'date-fns';

interface ScreeningCardProps {
  screening: PendingScreeningResponseDto;
  onReview: (applicationId: string) => void;
}

export const ScreeningCard = ({ screening, onReview }: ScreeningCardProps) => {
  const matchPercentage = screening.requiredSkills > 0
    ? Math.round((screening.matchingSkills / screening.requiredSkills) * 100)
    : 0;

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">{screening.candidateName || 'Unknown Candidate'}</h3>
            </div>
            <p className="text-sm text-gray-600">{screening.candidateEmail}</p>
          </div>
          <Badge className={getMatchColor(matchPercentage)}>
            {matchPercentage}% Match
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">{screening.jobTitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              Applied
            </div>
            <p className="text-sm font-medium">
              {format(new Date(screening.applicationDate), 'MMM dd, yyyy')}
            </p>
          </div>

          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Briefcase className="h-4 w-4 mr-1" />
              Experience
            </div>
            <p className="text-sm font-medium">{screening.totalExperience || 0} years</p>
          </div>
        </div>

        {screening.currentCompany && (
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Briefcase className="h-4 w-4 mr-1" />
              Current Company
            </div>
            <p className="text-sm font-medium">{screening.currentCompany}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{screening.matchingSkills}</p>
            <p className="text-xs text-gray-600">Matching Skills</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{screening.requiredSkills}</p>
            <p className="text-xs text-gray-600">Required Skills</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {screening.hasBeenScreenedBefore && (
          <Badge variant="secondary">Previously Screened</Badge>
        )}
        {screening.resumeFilePath && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(screening.resumeFilePath, '_blank')}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Resume
          </Button>
        )}
        <Button
          className="ml-auto"
          onClick={() => onReview(screening.applicationId)}
        >
          Review Application
        </Button>
      </CardFooter>
    </Card>
  );
};