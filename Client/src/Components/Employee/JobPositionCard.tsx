import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import type { JobPosition } from '@/types/job.types';
import { MapPin, Briefcase, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobPositionCardProps {
  job: JobPosition;
  onDelete?: (id: string) => void;
}

const JobPositionCard = ({ job, onDelete }: JobPositionCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 2:
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 3:
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{job.department}</p>
          </div>
          {getStatusBadge(job.statusId)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{job.salary ? `₹${job.salary.toLocaleString()}` : 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Required Skills:</div>
          <div className="flex flex-wrap gap-1">
            {job.requiredSkills.slice(0, 5).map((skill, idx) => (
              <Badge key={idx} variant="secondary">
                {skill.skillName}
              </Badge>
            ))}
            {job.requiredSkills.length > 5 && (
              <Badge variant="secondary">
                +{job.requiredSkills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => navigate(`/employee/jobs/${job.id}`)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/employee/jobs/edit/${job.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(job.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPositionCard;
