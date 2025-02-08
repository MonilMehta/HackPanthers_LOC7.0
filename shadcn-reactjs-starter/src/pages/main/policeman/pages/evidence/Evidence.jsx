import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  FileText, 
  Image, 
  Video, 
  MessageSquare, 
  Plus,
  ChevronRight,
  ChevronDown,
  Upload
} from 'lucide-react';

const Evidence = () => {
  // Sample data - replace with your backend data
  const [cases, setCases] = useState([
    {
      id: "case-001",
      title: "Robbery at Central Bank",
      status: "active",
      dateCreated: "2024-02-08",
      evidence: [
        {
          id: "ev-001",
          type: "image",
          title: "Security Camera Footage",
          description: "Front entrance camera capture at 10:30 PM",
          dateAdded: "2024-02-08",
          url: "/evidence/001.jpg"
        },
        {
          id: "ev-002",
          type: "document",
          title: "Witness Statement",
          description: "Statement from security guard on duty",
          dateAdded: "2024-02-08",
          url: "/evidence/statement.pdf"
        }
      ]
    },
    {
      id: "case-002",
      title: "Vehicle Theft Investigation",
      status: "pending",
      dateCreated: "2024-02-07",
      evidence: [
        {
          id: "ev-003",
          type: "video",
          title: "Parking Lot Footage",
          description: "CCTV recording from 8PM-9PM",
          dateAdded: "2024-02-07",
          url: "/evidence/parking.mp4"
        }
      ]
    }
  ]);

  const [expandedCases, setExpandedCases] = useState({});
  const [selectedCase, setSelectedCase] = useState(null);
  const [uploadingTo, setUploadingTo] = useState(null);

  const toggleCase = (caseId) => {
    setExpandedCases(prev => ({
      ...prev,
      [caseId]: !prev[caseId]
    }));
  };

  const getEvidenceIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleFileUpload = (caseId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Here you would typically upload to your backend/cloud storage
    // For now, we'll simulate adding the file to the case
    const newEvidence = {
      id: `ev-${Date.now()}`,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      title: file.name,
      description: 'Recently uploaded evidence',
      dateAdded: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file)
    };

    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? { ...c, evidence: [...c.evidence, newEvidence] }
          : c
      )
    );
    setUploadingTo(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Digital Evidence Management
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cases.map(case_ => (
              <div key={case_.id} className="border rounded-lg">
                <div 
                  className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCase(case_.id)}
                >
                  {expandedCases[case_.id] ? 
                    <ChevronDown className="w-4 h-4 mr-2" /> : 
                    <ChevronRight className="w-4 h-4 mr-2" />
                  }
                  <FolderOpen className="w-5 h-5 mr-3 text-yellow-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{case_.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created on {case_.dateCreated}
                    </p>
                  </div>
                  <Badge 
                    variant={case_.status === 'active' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {case_.status}
                  </Badge>
                </div>

                {expandedCases[case_.id] && (
                  <div className="border-t p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Evidence Files</h4>
                      <div>
                        <input
                          type="file"
                          id={`file-${case_.id}`}
                          className="hidden"
                          onChange={(e) => handleFileUpload(case_.id, e)}
                          accept="image/*,video/*,.pdf,.doc,.docx"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setUploadingTo(case_.id)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Add Evidence
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {case_.evidence.map(evidence => (
                        <div 
                          key={evidence.id}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 border"
                        >
                          {getEvidenceIcon(evidence.type)}
                          <div className="ml-3 flex-1">
                            <h5 className="font-medium">{evidence.title}</h5>
                            <p className="text-sm text-gray-500">
                              {evidence.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {evidence.dateAdded}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;