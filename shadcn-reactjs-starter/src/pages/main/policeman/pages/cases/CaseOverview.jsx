import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter,
  Plus,
  Clock,
  MapPin,
  FileText,
  Tag,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CaseOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Sample case data with more details
  const allCases = [
    {
      caseNumber: "FIR2024-001",
      status: "Open",
      priority: "High",
      dateReported: "2024-02-08",
      location: "Sector 18, Mumbai",
      crimeType: "Theft",
      description: "Armed robbery at local convenience store",
      assignedTo: "Inspector Sharma",
      lastUpdated: "2024-02-08 15:30",
      evidenceCount: 5,
      witnesses: 3,
      suspects: 2
    },
    {
      caseNumber: "FIR2024-002",
      status: "Under Investigation",
      priority: "Medium",
      dateReported: "2024-02-07",
      location: "Andheri West",
      crimeType: "Assault",
      description: "Physical altercation reported at residential complex",
      assignedTo: "Inspector Patel",
      lastUpdated: "2024-02-07 18:45",
      evidenceCount: 3,
      witnesses: 4,
      suspects: 1
    },
    {
      caseNumber: "FIR2024-003",
      status: "Closed",
      priority: "Low",
      dateReported: "2024-02-05",
      location: "Bandra East",
      crimeType: "Vandalism",
      description: "Property damage at public park",
      assignedTo: "Inspector Kumar",
      lastUpdated: "2024-02-06 09:15",
      evidenceCount: 2,
      witnesses: 2,
      suspects: 1
    }
  ];

  // Filter and search logic
  const filteredCases = useMemo(() => {
    return allCases.filter(case_ => {
      const matchesSearch = 
        case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || case_.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || case_.priority.toLowerCase() === priorityFilter.toLowerCase();
      
      let matchesTime = true;
      const caseDate = new Date(case_.dateReported);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      if (timeFilter === 'today') {
        matchesTime = caseDate.toDateString() === today.toDateString();
      } else if (timeFilter === 'week') {
        matchesTime = caseDate >= weekAgo;
      } else if (timeFilter === 'month') {
        matchesTime = caseDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesTime;
    });
  }, [searchTerm, statusFilter, priorityFilter, timeFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'under investigation':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600">Total Cases</p>
                <p className="text-2xl font-bold">{allCases.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600">Open Cases</p>
                <p className="text-2xl font-bold">
                  {allCases.filter(c => c.status === 'Open').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-yellow-600">Under Investigation</p>
                <p className="text-2xl font-bold">
                  {allCases.filter(c => c.status === 'Under Investigation').length}
                </p>
              </div>
              <User className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Closed Cases</p>
                <p className="text-2xl font-bold">
                  {allCases.filter(c => c.status === 'Closed').length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search case number, description, location..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under investigation">Under Investigation</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      {/* Case List */}
      <ScrollArea className="flex-1">
        <div className="grid gap-4">
          {filteredCases.map((case_) => (
            <Card key={case_.caseNumber} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold">{case_.caseNumber}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{case_.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityColor(case_.priority)}>
                      {case_.priority} Priority
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Case
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Case
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Reported: {new Date(case_.dateReported).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{case_.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{case_.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {case_.lastUpdated}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span>Evidence: {case_.evidenceCount}</span>
                  <span>•</span>
                  <span>Witnesses: {case_.witnesses}</span>
                  <span>•</span>
                  <span>Suspects: {case_.suspects}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CaseOverview;