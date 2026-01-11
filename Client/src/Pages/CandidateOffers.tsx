import { useEffect, useState } from 'react';
import { offerService } from '@/Services/CandidateOffersService';
import type { Offer } from '@/Types/offer.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import { 
  Gift, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface CandidateOffersProps {
  isProfileComplete: boolean;
}

const CandidateOffers = ({ isProfileComplete }: CandidateOffersProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if (isProfileComplete) {
      fetchOffers();
    }
  }, [isProfileComplete]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await offerService.getMyCandidateOffers();
      setOffers(data);
    } catch (error: any) {
      toast.error('Failed to fetch offers', {
        description: error.response?.data?.message || 'Could not load your offers',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOfferResponse = async (offerId: string, accept: boolean) => {
    try {
      setResponding(true);
      
      const statusId = accept ? 26 : 27;
      
      await offerService.updateOfferStatus({
        offerId,
        statusId,
      });

      toast.success(accept ? 'Offer accepted!' : 'Offer rejected', {
        description: accept 
          ? 'Congratulations! The HR team will contact you soon.' 
          : 'You have declined this offer.',
      });

      // Refresh offers
      await fetchOffers();
      setSelectedOffer(null);
    } catch (error: any) {
      toast.error('Failed to respond to offer', {
        description: error.response?.data?.message,
      });
    } finally {
      setResponding(false);
    }
  };

  const getStatusBadge = (statusName: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-amber-100 text-amber-800', icon: Clock },
      'Accepted': { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800', icon: XCircle },
      'Withdrawn': { className: 'bg-gray-100 text-gray-800', icon: XCircle },
      'Expired': { className: 'bg-gray-100 text-gray-800', icon: Clock },
    };

    const variant = variants[statusName] || variants['Pending'];
    const Icon = variant.icon;

    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {statusName}
      </Badge>
    );
  };

  const isOfferExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const canRespondToOffer = (offer: Offer) => {
    return offer.statusName === 'Pending' && !isOfferExpired(offer.expiryDate);
  };

  if (!isProfileComplete) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 mb-4">
            Please complete your profile to view job offers
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Job Offers</h1>
        <p className="text-gray-600 mt-1">
          Review and respond to job offers you've received
        </p>
      </div>

      {offers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No offers yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Keep applying! Offers will appear here once companies extend them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Offers List */}
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOffer?.id === offer.id
                    ? 'ring-2 ring-blue-500 shadow-md'
                    : ''
                }`}
                onClick={() => setSelectedOffer(offer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {offer.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Offered on {format(new Date(offer.offerDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {getStatusBadge(offer.statusName)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-green-600">
                        ₹{offer.offeredSalary.toLocaleString()} / year
                      </span>
                    </div>

                    {offer.joiningDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Joining: {format(new Date(offer.joiningDate), 'MMM dd, yyyy')}</span>
                      </div>
                    )}

                    {offer.expiryDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className={isOfferExpired(offer.expiryDate) ? 'text-red-600' : 'text-gray-600'}>
                          {isOfferExpired(offer.expiryDate) ? 'Expired on' : 'Valid until'}{' '}
                          {format(new Date(offer.expiryDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>

                  {canRespondToOffer(offer) && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-amber-600 font-medium">
                        ⚡ Action required - Respond to this offer
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Offer Details */}
          <div className="lg:sticky lg:top-6">
            {selectedOffer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Offer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedOffer.jobTitle}
                    </h3>
                    <div className="mt-2">
                      {getStatusBadge(selectedOffer.statusName)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <label className="text-sm font-medium text-green-900">
                        Offered Salary
                      </label>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        ₹{selectedOffer.offeredSalary.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-700 mt-1">Annual CTC</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Offer Date
                      </label>
                      <p className="text-gray-900 mt-1">
                        {format(new Date(selectedOffer.offerDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>

                    {selectedOffer.joiningDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Expected Joining Date
                        </label>
                        <p className="text-gray-900 mt-1">
                          {format(new Date(selectedOffer.joiningDate), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    )}

                    {selectedOffer.expiryDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Offer Valid Until
                        </label>
                        <p className={`mt-1 ${isOfferExpired(selectedOffer.expiryDate) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                          {format(new Date(selectedOffer.expiryDate), 'MMMM dd, yyyy')}
                          {isOfferExpired(selectedOffer.expiryDate) && ' (Expired)'}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Offered By
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedOffer.createdByName}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {canRespondToOffer(selectedOffer) ? (
                    <div className="space-y-3 pt-6 border-t">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900 font-medium">
                          📋 Please respond to this offer
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          You must accept or reject this offer before the expiry date
                        </p>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleOfferResponse(selectedOffer.id, true)}
                        disabled={responding}
                      >
                        {responding ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Offer
                          </>
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleOfferResponse(selectedOffer.id, false)}
                        disabled={responding}
                      >
                        {responding ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline Offer
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t">
                      <div className={`rounded-lg p-3 ${
                        selectedOffer.statusName === 'Accepted'
                          ? 'bg-green-50 border border-green-200'
                          : selectedOffer.statusName === 'Rejected'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <p className={`text-sm font-medium ${
                          selectedOffer.statusName === 'Accepted'
                            ? 'text-green-900'
                            : selectedOffer.statusName === 'Rejected'
                            ? 'text-red-900'
                            : 'text-gray-900'
                        }`}>
                          {selectedOffer.statusName === 'Accepted' && '✅ You have accepted this offer'}
                          {selectedOffer.statusName === 'Rejected' && '❌ You have declined this offer'}
                          {(selectedOffer.statusName === 'Expired' || isOfferExpired(selectedOffer.expiryDate)) && '⏰ This offer has expired'}
                          {selectedOffer.statusName === 'Withdrawn' && '🚫 This offer has been withdrawn'}
                        </p>
                        {selectedOffer.statusName === 'Accepted' && (
                          <p className="text-xs text-green-700 mt-1">
                            The HR team will contact you soon with next steps
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an offer to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateOffers;