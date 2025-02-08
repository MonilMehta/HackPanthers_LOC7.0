import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderOpen, 
  FileText, 
  Image, 
  Video, 
  MessageSquare, 
  Search,
  ChevronRight,
  ChevronDown,
  Upload,
  UserPlus,
  X
} from 'lucide-react';

const Evidence = () => {
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
      ],
      witnesses: [
        {
          id: "w-001",
          name: "John Doe",
          statement: "I was on duty when I noticed suspicious activity...",
          dateAdded: "2024-02-08"
        }
      ]
    },
    // ... other cases
  ]);

  const [expandedCases, setExpandedCases] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showWitnessForm, setShowWitnessForm] = useState(null);
  const [newWitness, setNewWitness] = useState({
    name: "",
    statement: ""
  });

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
    const files = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
      const newEvidence = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    });
  };

  const handleAddWitness = (caseId) => {
    if (!newWitness.name || !newWitness.statement) return;

    const witness = {
      id: `w-${Date.now()}`,
      ...newWitness,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setCases(prevCases =>
      prevCases.map(c =>
        c.id === caseId
          ? { ...c, witnesses: [...(c.witnesses || []), witness] }
          : c
      )
    );

    setNewWitness({ name: "", statement: "" });
    setShowWitnessForm(null);
  };

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    case_.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Digital Evidence Management
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search cases..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map(case_ => (
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
                    {/* Evidence Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Evidence Files</h4>
                        <div>
                          <input
                            type="file"
                            id={`file-${case_.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(case_.id, e)}
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            multiple
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById(`file-${case_.id}`).click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Files
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

                    {/* Witness Statements Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Witness Statements</h4>
                        <Button
                          variant="outline"
                          onClick={() => setShowWitnessForm(case_.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Witness
                        </Button>
                      </div>

                      {showWitnessForm === case_.id && (
                        <div className="mb-4 p-4 border rounded-lg">
                          <div className="flex justify-between mb-2">
                            <h5 className="font-medium">New Witness Statement</h5>
                            <button
                              onClick={() => setShowWitnessForm(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <Input
                            placeholder="Witness Name"
                            className="mb-2"
                            value={newWitness.name}
                            onChange={(e) => setNewWitness(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                          />
                          <Textarea
                            placeholder="Witness Statement"
                            className="mb-2"
                            value={newWitness.statement}
                            onChange={(e) => setNewWitness(prev => ({
                              ...prev,
                              statement: e.target.value
                            }))}
                          />
                          <Button
                            onClick={() => handleAddWitness(case_.id)}
                            className="w-full"
                          >
                            Save Statement
                          </Button>
                        </div>
                      )}

                      <div className="space-y-2">
                        {case_.witnesses?.map(witness => (
                          <div 
                            key={witness.id}
                            className="p-3 rounded-lg border hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{witness.name}</h5>
                              <Badge variant="outline">
                                {witness.dateAdded}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {witness.statement}
                            </p>
                          </div>
                        ))}
                      </div>
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