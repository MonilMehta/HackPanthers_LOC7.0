import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Users, Shield, FileText, History } from "lucide-react";

const CaseDetails = () => {
  // Sample data - replace with your actual data
  const caseData = {
    complainant: {
      name: "John Doe",
      contact: "555-0123",
      address: "123 Main St",
      dateReported: "2024-02-08"
    },
    suspects: [
      { name: "Jane Smith", status: "At Large", lastKnownLocation: "456 Oak Ave" }
    ],
    witnesses: [
      { name: "Mike Johnson", contact: "555-0124", statement: "Witnessed incident at 9PM" }
    ],
    officers: [
      { name: "Officer Sarah Wilson", badge: "12345", role: "Lead Investigator" },
      { name: "Officer Tom Brown", badge: "12346", role: "Supporting Officer" }
    ],
    evidence: [
      { id: "EV001", type: "Photo", description: "Crime scene photo", location: "Digital Storage" },
      { id: "EV002", type: "Document", description: "Witness statement", location: "Case File" }
    ],
    timeline: [
      { date: "2024-02-08 21:00", event: "Incident Occurred" },
      { date: "2024-02-08 21:15", event: "911 Call Received" },
      { date: "2024-02-08 21:30", event: "Officers Arrived on Scene" }
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Tabs defaultValue="complainant" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="complainant" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Complainant
          </TabsTrigger>
          <TabsTrigger value="suspects" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Suspects
          </TabsTrigger>
          <TabsTrigger value="witnesses" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Witnesses
          </TabsTrigger>
          <TabsTrigger value="officers" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Officers
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complainant">
          <Card>
            <CardHeader>
              <CardTitle>Complainant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name</p>
                  <p>{caseData.complainant.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Contact</p>
                  <p>{caseData.complainant.contact}</p>
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p>{caseData.complainant.address}</p>
                </div>
                <div>
                  <p className="font-semibold">Date Reported</p>
                  <p>{caseData.complainant.dateReported}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspects">
          <Card>
            <CardHeader>
              <CardTitle>Suspects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Known Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.suspects.map((suspect, index) => (
                    <TableRow key={index}>
                      <TableCell>{suspect.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{suspect.status}</Badge>
                      </TableCell>
                      <TableCell>{suspect.lastKnownLocation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="witnesses">
          <Card>
            <CardHeader>
              <CardTitle>Witnesses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.witnesses.map((witness, index) => (
                    <TableRow key={index}>
                      <TableCell>{witness.name}</TableCell>
                      <TableCell>{witness.contact}</TableCell>
                      <TableCell>{witness.statement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officers">
          <Card>
            <CardHeader>
              <CardTitle>Officers Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Badge Number</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.officers.map((officer, index) => (
                    <TableRow key={index}>
                      <TableCell>{officer.name}</TableCell>
                      <TableCell>{officer.badge}</TableCell>
                      <TableCell>{officer.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.evidence.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline of Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {caseData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4 border-l-2 border-gray-200 pl-4 pb-4">
                      <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{event.date}</p>
                        <p>{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseDetails;