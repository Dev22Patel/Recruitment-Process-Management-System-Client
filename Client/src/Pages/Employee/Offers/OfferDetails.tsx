import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { offerService } from '@/Services/OfferService';
import type { Offer } from '@/Types/offer.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, User, Briefcase, DollarSign, Calendar, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const OfferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOfferDetails();
    }
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const data = await offerService.getOfferById(id!);
      setOffer(data);
    } catch (error: any) {
      toast.error('Failed to fetch offer details');
      navigate('/employee/offers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statusName: string) => {
    const variants: Record<string, string> = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
      Accepted: 'bg-green-100 text-green-800 border-green-200',
      Rejected: 'bg-red-100 text-red-800 border-red-200',
      Withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
      Expired: 'bg-red-100 text-red-800 border-red-200',
    };
    return variants[statusName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Offer not found</p>
        <Button className="mt-4" onClick={() => navigate('/employee/offers')}>
          Back to Offers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/employee/offers')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offer Details</h1>
            <p className="text-gray-600 mt-1">View offer information</p>
          </div>
        </div>
        <Badge className={getStatusBadge(offer.statusName)}>
          {offer.statusName}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Candidate Name
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{offer.candidateName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Position
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{offer.jobTitle}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Offered Salary
                </label>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ₹{offer.offeredSalary.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Annual CTC</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Status
                </label>
                <Badge className={`${getStatusBadge(offer.statusName)} mt-2`}>
                  {offer.statusName}
                </Badge>
              </div>

              {offer.joiningDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Joining Date</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(offer.joiningDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}

              {offer.expiryDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Offer Expires On</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(offer.expiryDate), 'MMMM dd, yyyy')}
                  </p>
                  {new Date(offer.expiryDate) < new Date() && (
                    <p className="text-sm text-red-600 mt-1">⚠️ Expired</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Offer Date</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(offer.offerDate), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Created By</label>
                <p className="text-gray-900 mt-1">{offer.createdByName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions & Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/employee/offers')}
              >
                Back to Offers
              </Button>
              
              {offer.statusName === 'Accepted' && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/employee/employees/onboard')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Onboard Employee
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">Offer Created</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(offer.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">By {offer.createdByName}</p>
                  </div>
                </div>

                {offer.statusName !== 'Pending' && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${
                        offer.statusName === 'Accepted' ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Offer {offer.statusName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(offer.offerDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {offer.statusName === 'Pending' && offer.expiryDate && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-800">
                  ⏰ Waiting for candidate response
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Expires on {format(new Date(offer.expiryDate), 'MMM dd, yyyy')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;


//just for testing and learning i am doing this 
// export { default as OfferList } from './OfferList';
// export { default as CreateOffer } from './CreateOffer';
// export { default as OfferDetails } from './OfferDetails';