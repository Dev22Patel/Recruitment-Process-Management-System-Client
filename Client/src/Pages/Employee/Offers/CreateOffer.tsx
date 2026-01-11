import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '@/Services/ApplicationService';
import { documentService } from '@/Services/DocumentService';
import { offerService } from '@/Services/OfferService';
import type { Application } from '@/Types/application.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, DollarSign, Calendar, User, Briefcase, Loader2, Gift, AlertCircle } from 'lucide-react';

const CreateOffer = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVerifiedDocs, setHasVerifiedDocs] = useState(false);
  const [checkingDocs, setCheckingDocs] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    offeredSalary: '',
    joiningDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(applicationId!);
      
      if (data.statusName !== 'Selected') {
        toast.error('Can only create offers for selected candidates');
        navigate('/employee/applications');
        return;
      }

      setApplication(data);
      
      // Check if documents are verified
      await checkDocuments(data.candidateId);
      
      // Pre-fill expected salary if available
      if (data.expectedSalary !== undefined && data.expectedSalary !== null) {
        setFormData(prev => ({ ...prev, offeredSalary: data.expectedSalary!.toString() }));
      }

      // Set default joining date to 30 days from now
      const defaultJoining = new Date();
      defaultJoining.setDate(defaultJoining.getDate() + 30);
      
      // Set default expiry date to 7 days from now
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 7);
      
      setFormData(prev => ({ 
        ...prev, 
        joiningDate: defaultJoining.toISOString().split('T')[0],
        expiryDate: defaultExpiry.toISOString().split('T')[0] 
      }));

    } catch (error: any) {
      toast.error('Failed to fetch application details');
      navigate('/employee/applications');
    } finally {
      setLoading(false);
    }
  };

  const checkDocuments = async (candidateId: string) => {
    try {
      setCheckingDocs(true);
      const hasRequired = await documentService.hasRequiredDocuments(candidateId);
      setHasVerifiedDocs(hasRequired);
      
      if (!hasRequired) {
        toast.warning('Candidate documents are not verified yet');
      }
    } catch (error) {
      console.error('Error checking documents:', error);
      setHasVerifiedDocs(false);
    } finally {
      setCheckingDocs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.offeredSalary || !formData.joiningDate || !formData.expiryDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const offeredSalary = parseFloat(formData.offeredSalary);
    if (isNaN(offeredSalary) || offeredSalary <= 0) {
      toast.error('Please enter a valid salary amount');
      return;
    }

    // Parse dates as local dates (not UTC)
    const joiningDate = new Date(formData.joiningDate + 'T00:00:00');
    const expiryDate = new Date(formData.expiryDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (joiningDate < today) {
      toast.error('Joining date cannot be in the past');
      return;
    }

    if (expiryDate < today) {
      toast.error('Expiry date cannot be in the past');
      return;
    }

    if (expiryDate >= joiningDate) {
      toast.error('Expiry date must be before joining date');
      return;
    }

    // Warn if documents not verified
    if (!hasVerifiedDocs) {
      const confirmed = window.confirm(
        'Warning: Required documents are not verified yet. Do you want to proceed anyway?'
      );
      if (!confirmed) return;
    }

    try {
      setSubmitting(true);
      
      // Convert date strings to ISO DateTime format for backend
      const joiningDateISO = new Date(formData.joiningDate + 'T00:00:00').toISOString();
      const expiryDateISO = new Date(formData.expiryDate + 'T00:00:00').toISOString();
      
      const createOfferDto = {
        applicationId: applicationId!,
        offeredSalary: offeredSalary,
        joiningDate: joiningDateISO,
        expiryDate: expiryDateISO,
      };

      console.log('Creating offer with data:', createOfferDto);

      const result = await offerService.createOffer(createOfferDto);
      
      toast.success('Offer created successfully');
      navigate(`/employee/offers/${result.id}`);
      
    } catch (error: any) {
      console.error('Error creating offer:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create offer';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 font-medium">Application not found</p>
        <Button className="mt-4" onClick={() => navigate('/employee/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Job Offer</h1>
          <p className="text-gray-600 mt-1">Generate offer for selected candidate</p>
        </div>
      </div>

      {/* Document Warning */}
      {!checkingDocs && !hasVerifiedDocs && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Documents Not Verified</p>
                <p className="text-sm text-amber-800 mt-1">
                  The candidate's required documents have not been verified yet. 
                  It's recommended to verify documents before creating an offer.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate('/employee/documents/verification')}
                >
                  Go to Document Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Candidate Name
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {application.candidateName}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job Position
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {application.jobTitle}
              </p>
              <p className="text-sm text-gray-600 mt-1">{application.department}</p>
            </div>

            {application.expectedSalary && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Expected Salary
                </label>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  ₹{application.expectedSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Annual CTC</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/employee/applications/${application.id}`)}
              >
                View Full Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Offer Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="offeredSalary">
                  Offered Salary (Annual CTC) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="offeredSalary"
                    type="number"
                    step="0.01"
                    placeholder="Enter salary amount"
                    value={formData.offeredSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, offeredSalary: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
                {application.expectedSalary && (
                  <p className="text-sm text-gray-500">
                    Expected: ₹{application.expectedSalary.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">
                    Joining Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) =>
                        setFormData({ ...formData, joiningDate: e.target.value })
                      }
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">
                    Offer Expiry Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Candidate must accept before this date
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Important Notes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Offer will be sent to the candidate via email</li>
                  <li>• Candidate can accept or reject the offer</li>
                  <li>• Offer expires on the specified expiry date</li>
                  <li>• Expiry date must be before joining date</li>
                  <li>• You can track offer status in the offers list</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Offer...
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Create Offer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOffer;