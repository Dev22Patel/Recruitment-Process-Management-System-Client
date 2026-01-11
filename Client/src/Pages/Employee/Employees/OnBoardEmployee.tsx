// src/Pages/Employee/Employees/OnboardEmployee.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '@/Services/EmployeeService';
import { offerService } from '@/Services/OfferService';
import type { Offer } from '@/Types/offer.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus, Loader2, CheckCircle } from 'lucide-react';

const OnboardEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  const [formData, setFormData] = useState({
    joiningDate: '',
    department: '',
  });

  useEffect(() => {
    fetchAcceptedOffers();
  }, []);

  const fetchAcceptedOffers = async () => {
    try {
      setLoading(true);
      const allOffers = await offerService.getAllOffers();
      // Filter only accepted offers
      const accepted = allOffers.filter(offer => offer.statusId === 24);
      setAcceptedOffers(accepted);
    } catch (error: any) {
      toast.error('Failed to fetch accepted offers');
    } finally {
      setLoading(false);
    }
  };

  const handleOfferSelect = (offer: Offer) => {
    setSelectedOffer(offer);
    // Pre-fill joining date from offer if available
    if (offer.joiningDate) {
      setFormData(prev => ({
        ...prev,
        joiningDate: new Date(offer.joiningDate!).toISOString().split('T')[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOffer) {
      toast.error('Please select an offer');
      return;
    }

    try {
      setSubmitting(true);
      await employeeService.onboardCandidate({
        candidateId: selectedOffer.applicationId, // This should be candidateId from application
        jobPositionId: selectedOffer.applicationId, // This should be jobPositionId from application
        joiningDate: formData.joiningDate,
        department: formData.department,
      });

      toast.success('Employee onboarded successfully', {
        description: 'Welcome email sent to the employee',
      });
      navigate('/employee/employees');
    } catch (error: any) {
      toast.error('Failed to onboard employee', {
        description: error.response?.data?.message,
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/employee/employees')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onboard Employee</h1>
          <p className="text-gray-600 mt-1">Convert candidate to employee</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Accepted Offer</CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedOffers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No accepted offers</p>
                <p className="text-sm text-gray-500 mt-1">
                  Candidates must accept offers before onboarding
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOffer?.id === offer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOfferSelect(offer)}
                  >
                    <h3 className="font-semibold text-gray-900">{offer.candidateName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{offer.jobTitle}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Salary: ₹{offer.offeredSalary.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedOffer ? (
              <div className="text-center py-12 text-gray-500">
                Select an offer to continue
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-600">Selected Candidate</p>
                  <p className="font-semibold text-gray-900">{selectedOffer.candidateName}</p>
                  <p className="text-sm text-gray-600">{selectedOffer.jobTitle}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date *</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Engineering"
                  />
                  <p className="text-sm text-gray-500">
                    Employee code will be auto-generated based on department
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    📧 A welcome email with employee details will be sent automatically.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Onboarding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Onboard Employee
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/employee/employees')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardEmployee;