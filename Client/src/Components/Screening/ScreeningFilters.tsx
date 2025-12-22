import { Search, Filter } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

interface ScreeningFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterByMatch: string;
  onFilterByMatchChange: (value: string) => void;
}

export const ScreeningFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterByMatch,
  onFilterByMatchChange,
}: ScreeningFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by candidate name, email, or job title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filterByMatch} onValueChange={onFilterByMatchChange}>
        <SelectTrigger className="w-full sm:w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by match" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Applications</SelectItem>
          <SelectItem value="high">High Match (80%+)</SelectItem>
          <SelectItem value="medium">Medium Match (50-79%)</SelectItem>
          <SelectItem value="low">Low Match (&lt;50%)</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Newest First</SelectItem>
          <SelectItem value="date-asc">Oldest First</SelectItem>
          <SelectItem value="match-desc">Best Match First</SelectItem>
          <SelectItem value="match-asc">Worst Match First</SelectItem>
          <SelectItem value="experience-desc">Most Experience</SelectItem>
          <SelectItem value="experience-asc">Least Experience</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};