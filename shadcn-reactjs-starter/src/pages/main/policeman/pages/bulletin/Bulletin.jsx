import React, { useState } from 'react';
import { AlertCircle, Bell, Shield, Car, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Badge
} from '@/components/ui/badge';

const Bulletin = () => {
  const [bulletins, setBulletins] = useState([
    {
      id: 1,
      title: "Community Watch Meeting",
      content: "Monthly community watch meeting scheduled for next Friday at 6 PM in the Town Hall.",
      type: "community",
      date: "2025-02-05",
      priority: "normal"
    },
    {
      id: 2,
      title: "Traffic Advisory",
      content: "Road work on Main Street between 5th and 7th Avenue. Expect delays.",
      type: "traffic",
      date: "2025-02-08",
      priority: "high"
    }
  ]);

  const [newBulletin, setNewBulletin] = useState({
    title: "",
    content: "",
    type: "general",
    priority: "normal"
  });

  const bulletinTemplates = {
    traffic: "Road closure/construction at [LOCATION]. Expected duration: [TIME]. Please use alternate routes.",
    emergency: "Emergency situation reported at [LOCATION]. Please avoid the area and follow official instructions.",
    community: "Community event: [EVENT] scheduled for [DATE] at [LOCATION]. All residents welcome.",
    crime: "Recent [INCIDENT] reported in [AREA]. Residents advised to [SAFETY MEASURES]."
  };

  const handleTemplateSelect = (template) => {
    setNewBulletin(prev => ({
      ...prev,
      content: bulletinTemplates[template]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBulletins(prev => [...prev, {
      id: Date.now(),
      ...newBulletin,
      date: new Date().toISOString().split('T')[0]
    }]);
    setNewBulletin({
      title: "",
      content: "",
      type: "general",
      priority: "normal"
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'traffic': return <Car className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'crime': return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-[400px,1fr] gap-6">
        {/* Form Section */}
        <Card className="md:sticky md:top-6 h-fit">
          <CardHeader>
            <CardTitle>Create Bulletin</CardTitle>
            <CardDescription>Post a new community advisory or notice</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newBulletin.title}
                  onChange={(e) => setNewBulletin(prev => ({...prev, title: e.target.value}))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newBulletin.type}
                  onValueChange={(value) => {
                    setNewBulletin(prev => ({...prev, type: value}));
                    handleTemplateSelect(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="crime">Crime Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newBulletin.priority}
                  onValueChange={(value) => setNewBulletin(prev => ({...prev, priority: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  className="min-h-[120px]"
                  value={newBulletin.content}
                  onChange={(e) => setNewBulletin(prev => ({...prev, content: e.target.value}))}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Post Bulletin
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bulletins Display Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">Recent Bulletins</h2>
          {bulletins.map(bulletin => (
            <Card key={bulletin.id} className="overflow-hidden">
              <div className={`h-1 ${
                bulletin.priority === 'urgent' ? 'bg-red-500' :
                bulletin.priority === 'high' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{bulletin.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{bulletin.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getTypeIcon(bulletin.type)}
                      {bulletin.type}
                    </Badge>
                    <Badge className={getPriorityColor(bulletin.priority)}>
                      {bulletin.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600">{bulletin.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bulletin;