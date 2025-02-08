import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  UserPlus,
  ClipboardEdit,
  MessageSquarePlus,
  BarChart3,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';

const CaseAction = ({ caseId }) => {
  const [notification, setNotification] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Sample data
  const statusOptions = ['Under Investigation', 'Pending', 'Closed'];
  const officerOptions = ['Inspector Sharma', 'Inspector Patel', 'Inspector Kumar'];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification({
      type: 'success',
      message: 'Action completed successfully!'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const actions = [
    {
      id: 'new-case',
      title: 'Create New Case',
      icon: <Plus className="h-4 w-4" />,
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Case Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>
            <Input placeholder="Case Number (auto-generated)" disabled />
            <Input placeholder="Case Title" required />
            <Textarea placeholder="Case Description" required className="min-h-[100px]" />
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Case Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Location Details</h3>
            <Input placeholder="Street Address" required />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="City" required />
              <Input placeholder="State" required />
            </div>
            <Input placeholder="Pincode" required type="number" />
          </div>

          {/* Reported By Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Reported By</h3>
            <Input placeholder="Full Name" required />
            <Input placeholder="Contact Number" required type="tel" />
            <Input placeholder="Email" type="email" />
            <Textarea placeholder="Address" />
          </div>

          {/* Evidence Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Evidence</h3>
            <Input 
              type="file" 
              multiple 
              accept="image/*,video/*,.pdf,.doc,.docx" 
              onChange={handleFileChange}
            />
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Witness Statements */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Witness Statements</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Witness Name" />
              <Input placeholder="Contact Number" type="tel" />
            </div>
            <Textarea placeholder="Witness Statement" />
            <Button type="button" variant="outline" className="w-full">
              + Add Another Witness
            </Button>
          </div>
        </form>
      )
    },
    {
      id: 'update-status',
      title: 'Update Status',
      icon: <ClipboardEdit className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Reason for status update" />
        </div>
      )
    },
    {
      id: 'add-notes',
      title: 'Add Notes/Updates',
      icon: <MessageSquarePlus className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Update Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investigation">Investigation Update</SelectItem>
              <SelectItem value="witness">Witness Statement</SelectItem>
              <SelectItem value="evidence">Evidence Notes</SelectItem>
              <SelectItem value="general">General Note</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Enter your notes here..." className="min-h-[200px]" />
          <Input type="datetime-local" />
        </div>
      )
    },
    {
      id: 'assign-officers',
      title: 'Assign Officers',
      icon: <UserPlus className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Officer" />
            </SelectTrigger>
            <SelectContent>
              {officerOptions.map(officer => (
                <SelectItem key={officer} value={officer.toLowerCase()}>{officer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead Investigator</SelectItem>
              <SelectItem value="support">Supporting Officer</SelectItem>
              <SelectItem value="specialist">Specialist</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Assignment Notes" />
        </div>
      )
    },
    {
      id: 'generate-reports',
      title: 'Generate Reports',
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investigation">Investigation Report</SelectItem>
              <SelectItem value="evidence">Evidence Summary</SelectItem>
              <SelectItem value="witness">Witness Statements</SelectItem>
              <SelectItem value="progress">Progress Report</SelectItem>
              <SelectItem value="full">Full Case Report</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" placeholder="Start Date" />
            <Input type="date" placeholder="End Date" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">DOC</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full">
            Preview Report
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {notification && (
        <Alert variant={notification.type === 'success' ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Dialog key={action.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {action.title}
                  </CardTitle>
                  {action.icon}
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{action.title}</DialogTitle>
                <DialogDescription>
                  Fill in the details below to {action.title.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              {action.content}
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default CaseAction;