import React, { useEffect, useState } from 'react';
import { MapPin, Badge, Calendar, Phone, Mail, Briefcase, AlertCircle, Loader2, Search, RefreshCw, UserCheck, Clock, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Personal = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState('all');
  const [filterStation, setFilterStation] = useState('all');

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/users/getUser');
      if (!response.ok) throw new Error('Failed to fetch officer data');
      const data = await response.json();
      if (data.success) {
        setOfficers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch officer data');
      }
    } catch (error) {
      console.error('Failed to fetch officers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.policeDetails.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = filterRank === 'all' || officer.policeDetails.rank === filterRank;
    const matchesStation = filterStation === 'all' || officer.policeDetails.station === filterStation;
    return matchesSearch && matchesRank && matchesStation;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black-50 to-gray-50">
        <Loader2 className="h-8 w-8 text-black-600 animate-spin mb-4" />
        <div className="text-xl text-gray-600">Loading officer profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black-50 to-gray-50 p-6">
        <Alert variant="destructive" className="max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon: UserCheck, label: 'Total Officers', value: officers.length },
        { icon: Briefcase, label: 'Active Cases', value: officers.reduce((acc, officer) => acc + officer.policeDetails.assignedCases.length, 0) },
        { icon: Clock, label: 'On Duty', value: Math.floor(officers.length * 0.8) },
        { icon: FileText, label: 'Reports Filed', value: officers.reduce((acc, officer) => acc + officer.policeDetails.assignedCases.filter(c => c.status === 'Closed').length, 0) }
      ].map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <stat.icon className="h-8 w-8 text-black-600" />
          </div>
        </Card>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, username, or badge number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Select
          value={filterRank}
          onValueChange={setFilterRank}
          className="w-40"
        >
          <option value="all">All Ranks</option>
          {Array.from(new Set(officers.map(o => o.policeDetails.rank))).map(rank => (
            <option key={rank} value={rank}>{rank}</option>
          ))}
        </Select>
        <Select
          value={filterStation}
          onValueChange={setFilterStation}
          className="w-48"
        >
          <option value="all">All Stations</option>
          {Array.from(new Set(officers.map(o => o.policeDetails.station))).map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            setFilterRank('all');
            setFilterStation('all');
          }}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-black-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Police Officer Profiles</h1>
          <p className="text-gray-600">Managing {officers.length} Active Officers</p>
        </header>

        {renderStats()}
        {renderFilters()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredOfficers.map((officer) => (
            <Card key={officer._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
              <CardHeader className="bg-black-600 text-black p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{officer.fullname}</h2>
                    <p className="text-black-100 mt-1">{officer.username}</p>
                  </div>
                  <span className="px-4 py-1 bg-black-700 rounded-full text-sm font-medium shadow-sm">
                    {officer.policeDetails.rank}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <Badge className="w-5 h-5 text-black-600" />
                      <span className="text-gray-700">Badge: {officer.policeDetails.badgeNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <MapPin className="w-5 h-5 text-black-600" />
                      <span className="text-gray-700">{officer.policeDetails.station}</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-black-600" />
                      <span className="text-gray-700">{officer.phone_no}</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <Mail className="w-5 h-5 text-black-600" />
                      <span className="text-gray-700">{officer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <Calendar className="w-5 h-5 text-black-600" />
                      <span className="text-gray-700">DOB: {formatDate(officer.date_of_birth)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-black-600" />
                      <span className="font-medium text-gray-900">Address</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-700">
                        {officer.address.street}<br />
                        {officer.address.city}, {officer.address.state}<br />
                        {officer.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-black-600" />
                      <span className="font-medium text-gray-900">Assigned Cases</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {officer.policeDetails.assignedCases.length} total
                    </span>
                  </div>
                  <div className="space-y-4">
                    {officer.policeDetails.assignedCases.map((caseDetail) => (
                      <div 
                        key={caseDetail._id} 
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            Case #{caseDetail.caseNo}: {caseDetail.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium shadow-sm ${
                            caseDetail.status === 'Open' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {caseDetail.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{caseDetail.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {caseDetail.location.street}, {caseDetail.location.city}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Personal;