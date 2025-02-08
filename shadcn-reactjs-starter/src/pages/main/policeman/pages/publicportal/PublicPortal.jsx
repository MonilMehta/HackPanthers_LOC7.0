import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";



const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const PublicPortal = () => {
  const [cookies] = useCookies(['role']);
  const role = cookies.role || 'citizen';
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [chatRequests, setChatRequests] = useState([
    { id: 1, message: "Need help with filing a report." },
    { id: 2, message: "Query about local regulations." }
  ]);

  const [reports, setReports] = useState([
    { id: 1, summary: "Suspicious activity reported near downtown." },
    { id: 2, summary: "Vandalism in public park." }
  ]);

  useEffect(() => {
    if (role === 'admin') {
      fetch('/api/officers')
        .then(response => response.json())
        .then(data => setOfficers(data))
        .catch(error => console.error('Error fetching officers:', error));
    }
  }, [role]);

  const callGeminiAPI = async (userInput) => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userInput
            }]
          }],
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    try {
      setIsLoading(true);
      setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
      
      const response = await callGeminiAPI(chatInput);
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setChatInput('');
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I apologize, but I'm having trouble processing your request right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const handleOpenChat = (chatId) => {
    setSelectedChat(chatId);
    fetch(`/api/chats/${chatId}`)
      .then(response => response.json())
      .then(data => setChatMessages(data.messages))
      .catch(error => console.error('Error fetching chat messages:', error));
  };

  const handleRequestOfficerSupport = () => {
    const summary = chatMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    setChatRequests(prev => [...prev, { id: chatRequests.length + 1, message: summary }]);
    setChatMessages(prev => [...prev, {
      sender: 'bot',
      text: "I've requested officer support for you. An officer will review your chat and respond as soon as possible."
    }]);
  };

  const handleConvertToCase = (reportId) => {
    navigate(`/main/cases/CaseAction?reportId=${reportId}`);
  };

  const handleAssignCase = (reportId) => {
    if (!selectedOfficer) {
      alert('Please select an officer first.');
      return;
    }
    alert(`Case with Report ID ${reportId} assigned to Officer ID ${selectedOfficer}.`);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Public Portal</h1>

      {role === 'citizen' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] mb-4 p-4 rounded-lg border">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendChat} 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRequestOfficerSupport}
                disabled={isLoading}
              >
                Request Officer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(role === 'officer' || role === 'admin') && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Open Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="p-4 rounded-lg bg-muted cursor-pointer hover:bg-muted/80"
                    onClick={() => handleOpenChat(request.id)}
                  >
                    <p>{request.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedChat && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat with User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] mb-4 p-4 rounded-lg border">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendChat}>Send</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submitted Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                      <p className="flex-1">{report.summary}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary"
                          onClick={() => handleConvertToCase(report.id)}
                        >
                          Convert to Case
                        </Button>
                        {role === 'admin' && (
                          <div className="flex gap-2">
                            <Select
                              value={selectedOfficer}
                              onValueChange={setSelectedOfficer}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Officer" />
                              </SelectTrigger>
                              <SelectContent>
                                {officers.map(officer => (
                                  <SelectItem key={officer.id} value={officer.id}>
                                    {officer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="secondary"
                              onClick={() => handleAssignCase(report.id)}
                            >
                              Assign Officer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PublicPortal;