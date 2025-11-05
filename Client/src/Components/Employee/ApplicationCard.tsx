import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import type { Application } from '@/types/application.types';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { Calendar, MapPin, Briefcase, Mail, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{application.candidateName}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {application.candidateEmail}
            </div>
          </div>
          <ApplicationStatusBadge
            statusId={application.statusId}
            statusName={application.statusName}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{application.jobTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{application.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{application.totalExperience || 0} years exp</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Skill Match: </span>
            <Badge variant="outline">
              {application.matchingSkillsCount}/{application.requiredSkills.length}
            </Badge>
          </div>
          {application.candidateSkills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {application.candidateSkills.slice(0, 5).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {application.candidateSkills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{application.candidateSkills.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <Button
          className="w-full mt-2"
          onClick={() => navigate(`/employee/applications/${application.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
