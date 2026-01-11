import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { offerService } from '@/Services/OfferService';
import type { Offer } from '@/Types/offer.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { toast } from 'sonner';
import { Search, Eye, Gift, Filter, Loader2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/Context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

const OfferList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isHR = user?.roles === 'hr' || user?.roles?.includes('HR') || user?.roles?.includes('hr');

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [searchQuery, statusFilter, offers]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await offerService.getAllOffers();
      setOffers(data);
      setFilteredOffers(data);
    } catch (error: any) {
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = [...offers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.candidateName.toLowerCase().includes(query) ||
          offer.jobTitle.toLowerCase().includes(query) ||
          offer.createdByName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((offer) => offer.statusName === statusFilter);
    }

    setFilteredOffers(filtered);
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

  const getStatusCounts = () => {
    return {
      total: offers.length,
      pending: offers.filter((o) => o.statusName === 'Pending').length,
      accepted: offers.filter((o) => o.statusName === 'Accepted').length,
      rejected: offers.filter((o) => o.statusName === 'Rejected').length,
      expired: offers.filter((o) => o.statusName === 'Expired').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-600 mt-1">View and manage job offers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statusCounts.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{statusCounts.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.accepted}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.rejected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by candidate, job title, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No offers found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create offers for selected candidates'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {offer.candidateName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {offer.jobTitle}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(offer.statusName)}>
                        {offer.statusName}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Offered Salary</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          ₹{offer.offeredSalary.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Offer Date</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {format(new Date(offer.offerDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {offer.joiningDate && (
                        <div>
                          <p className="text-xs text-gray-500">Joining Date</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {format(new Date(offer.joiningDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {offer.expiryDate && (
                        <div>
                          <p className="text-xs text-gray-500">Expires On</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {format(new Date(offer.expiryDate), 'MMM dd, yyyy')}
                          </p>
                          {new Date(offer.expiryDate) < new Date() && (
                            <p className="text-xs text-red-600 mt-0.5">⚠️ Expired</p>
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Created By</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {offer.createdByName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/employee/offers/${offer.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferList;