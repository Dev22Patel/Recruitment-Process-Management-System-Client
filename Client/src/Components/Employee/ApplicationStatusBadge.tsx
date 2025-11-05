import { Badge } from '../ui/badge';

interface ApplicationStatusBadgeProps {
  statusId: number;
  statusName?: string;
}

const ApplicationStatusBadge = ({ statusId, statusName }: ApplicationStatusBadgeProps) => {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 4:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 5:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 6:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 7:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 8:
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Badge className={getStatusColor(statusId)}>
      {statusName || 'Unknown'}
    </Badge>
  );
};

export default ApplicationStatusBadge;
