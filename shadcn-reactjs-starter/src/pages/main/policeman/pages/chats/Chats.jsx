import React, { useState } from 'react';
import { 
  Search, MoreVertical, Send, Phone, Video, ChevronLeft, 
  Paperclip, Camera, Image, File, Clock, Plus,
  AlertTriangle, Shield, Car, User, MapPin
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const quickResponses = [
    {
      category: "Emergency",
      icon: <AlertTriangle className="h-4 w-4" />,
      templates: [
        "Requesting immediate backup at location",
        "Suspect spotted, need assistance",
        "Emergency situation reported at scene",
        "Medical emergency, ambulance required"
      ]
    },
    {
      category: "Status Updates",
      icon: <Shield className="h-4 w-4" />,
      templates: [
        "Situation under control",
        "Area secured, proceeding with investigation",
        "Patrol completed, no incidents to report",
        "Evidence collected and documented"
      ]
    },
    {
      category: "Vehicle Related",
      icon: <Car className="h-4 w-4" />,
      templates: [
        "Vehicle check required",
        "Traffic violation reported",
        "Suspicious vehicle spotted",
        "Vehicle pursuit in progress"
      ]
    },
    {
      category: "Personnel",
      icon: <User className="h-4 w-4" />,
      templates: [
        "Shift handover complete",
        "Requesting additional personnel",
        "Officer on scene",
        "Back on duty"
      ]
    }
  ];

  const users = [
    {
      id: 1,
      name: 'Commissioner Office',
      role: 'Head Department',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      lastMessage: 'Monthly review meeting tomorrow',
      time: '10:30 AM'
    },
    {
      id: 2,
      name: 'Traffic Control Unit',
      role: 'Department',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      lastMessage: 'Traffic updates for central area',
      time: '09:45 AM'
    },
    {
      id: 3,
      name: 'Emergency Response Team',
      role: 'Special Unit',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      lastMessage: 'Situation under control at Zone 3',
      time: '09:30 AM'
    },
    {
      id: 4,
      name: 'Cyber Crime Division',
      role: 'Special Unit',
      avatar: '/api/placeholder/32/32',
      status: 'offline',
      lastMessage: 'New cybercrime report filed',
      time: 'Yesterday'
    }
  ];

  const handleSendMessage = (text = message) => {
    if (text.trim() && selectedUser) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'me',
        content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : '*/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Here you would typically upload to your server
        // For demo, we'll just show a message
        setMessages([...messages, {
          id: messages.length + 1,
          sender: 'me',
          content: `📎 File attached: ${file.name}`,
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    };
    input.click();
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex rounded-lg overflow-hidden border">
      {/* Users List - Same as before */}
      <div className={`w-80 bg-white border-r ${selectedUser ? 'hidden md:block' : 'block'}`}>
        {/* Previous users list code remains the same */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" alt="PD" />
              <AvatarFallback>PD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Search departments or personnel"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500">{user.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                <span className="text-xs text-gray-400">{user.role}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header - Same as before */}
          <div className="p-4 border-b bg-white flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSelectedUser(null)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-medium">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">{selectedUser.status}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs ${
                      msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                    } float-right ml-2`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input with Attachments and Quick Responses */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2 mb-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleFileUpload('image')}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleFileUpload('document')}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleFileUpload('*')}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Other Files
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Clock className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    {quickResponses.map((category) => (
                      <div key={category.category}>
                        <div className="flex items-center gap-2 mb-2">
                          {category.icon}
                          <h3 className="font-medium">{category.category}</h3>
                        </div>
                        <div className="grid gap-2">
                          {category.templates.map((template) => (
                            <Button
                              key={template}
                              variant="ghost"
                              className="w-full justify-start h-auto py-2 text-sm"
                              onClick={() => handleSendMessage(template)}
                            >
                              {template}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={() => handleSendMessage()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-600">Welcome to Police Department Chat</h2>
            <p className="text-gray-500">Select a department or personnel to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;