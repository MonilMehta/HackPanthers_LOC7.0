import React, { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Send,
  Phone,
  Video,
  ChevronLeft,
  Paperclip,
  Camera,
  Image,
  File,
  Clock,
  Plus,
  AlertTriangle,
  Shield,
  Car,
  User,
  MapPin,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCookies } from "react-cookie";
import { getUsers } from "../../../../../apis/user.api";
import {
  getChats,
  getChatById,
  sendMessage,
  markAsRead,
} from "../../../../../apis/chat.api";
import axios from "axios";

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersWithChats, setUsersWithChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sending, setSending] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [cookies] = useCookies(["accessToken", "phone", "id"]);

  // Fetch users from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatsResponse = await axios.get(getChats, {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        });
        const chatUsers = chatsResponse.data.data.map((chat) => ({
          id: chat.chatDetails.participant.userId,
          name: chat.participantDetails.username,
          avatar: chat.participantDetails.avatar || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s`,
          lastMessage: chat.lastMessage?.message || "No messages yet",
          time: new Date(chat.lastMessage?.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unreadCount: chat.unreadCount,
          hasExistingChat: true,
          chatId: chat._id,
        }));

        setUsersWithChats(chatUsers);

        // Then fetch all users
        const usersResponse = await axios.get(getUsers, {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        });
        console.log(usersResponse);
        const allUsersList = usersResponse.data.data.map((user) => ({
          id: user._id,
          name: user.username,
          role: user.policeDetails.rank,
          avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s`,
          lastMessage: '',
          time: '',
          station: user.policeDetails.station,
          email: user.email,
          phone: user.phone_no,
          hasExistingChat: false,
        }));

        // Filter out users that already have chats
        const chatUserIds = new Set(chatUsers.map((user) => user.id));
        const usersWithoutChats = allUsersList.filter(
          (user) => !chatUserIds.has(user.id) && user.phone !== cookies.phone
        );

        console.log(usersWithoutChats);
        setAllUsers(usersWithoutChats);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = [...usersWithChats, ...allUsers].filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`${getChatById}/${chatId}`, {
        headers: { Authorization: `Bearer ${cookies.accessToken}` },
      });
      console.log(response);
      const chatData = response.data.data;
      setMessages(
        chatData.messages.map((msg, index) => ({
          id: index,
          sender: msg.senderId == cookies.id ? "me" : "other",
          content: msg.message,
          time: new Date(msg.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: msg.isRead,
          media: msg.media,
        }))
      );
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setError("Failed to load chat messages");
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setMessages([]); // Clear existing messages

    if (user.hasExistingChat) {
      setCurrentChatId(user.chatId);
      await fetchChatMessages(user.chatId);
      
      // Mark messages as read if there are unread messages
      if (user.unreadCount > 0) {
        await markMessagesAsRead(user.chatId);
      }
    } else {
      setCurrentChatId(null);
      setMessages([]);
    }
  };


  const handleSendMessage = async (text = message) => {
    if (!text.trim() || !selectedUser || sending) return;

    try {
      setSending(true);

      const messageData = {
        receiverId: selectedUser.id,
        chatId: currentChatId,
        message: text,
      };

      // Add optimistic message update
      const optimisticMessage = {
        id: Date.now(),
        sender: "me",
        content: text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        pending: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setMessage(""); // Clear input immediately for better UX

      const response = await axios.post(sendMessage, messageData, {
        headers: { Authorization: `Bearer ${cookies.accessToken}` },
      });

      // If this was a new chat, update the chatId and user status
      if (!currentChatId && response.data.data.chatId) {
        setCurrentChatId(response.data.data.chatId);

        // Update the selected user to show they now have an existing chat
        setSelectedUser((prev) => ({
          ...prev,
          hasExistingChat: true,
          chatId: response.data.data.chatId,
        }));

        // Update the users list to reflect the new chat
        setUsersWithChats((prev) => [
          ...prev,
          {
            ...selectedUser,
            hasExistingChat: true,
            chatId: response.data.data.chatId,
            lastMessage: text,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        // Remove the user from allUsers list since they now have a chat
        setAllUsers((prev) =>
          prev.filter((user) => user.id !== selectedUser.id)
        );
      }

      // Update the message list to remove the pending state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id
            ? {
                ...msg,
                id: response.data.data._id || msg.id,
                pending: false,
                time: new Date(response.data.data.sentAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              }
            : msg
        )
      );

      // Update the users list with the latest message
      setUsersWithChats((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                lastMessage: text,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove the optimistic message if there was an error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      setError("Failed to send message");
      // Restore the message text in the input
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "*/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("media", file);
          formData.append("receiverId", selectedUser.id);
          if (currentChatId) {
            formData.append("chatId", currentChatId);
          }

          const response = await axios.post(sendMessage, formData, {
            headers: {
              Authorization: `Bearer ${cookies.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          // Update UI with the new message
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "me",
              content: `📎 File attached: ${file.name}`,
              type: "file",
              fileName: file.name,
              fileType: file.type,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        } catch (err) {
          console.error("Error uploading file:", err);
          setError("Failed to upload file");
        }
      }
    };
    input.click();
  };

  const markMessagesAsRead = async (chatId) => {
    if (!chatId || markingAsRead) return;

    try {
      setMarkingAsRead(true);
      const response = await axios.post(
        markAsRead,
        { chatId },
        {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        }
      );

      console.log(response)
      // Update local state to reflect messages as read
      setUsersWithChats((prev) =>
        prev.map((user) =>
          user.chatId === chatId
            ? {
                ...user,
                unreadCount: 0,
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    } finally {
      setMarkingAsRead(false);
    }
  };

  const quickResponses = [
    {
      category: "Emergency",
      icon: <AlertTriangle className="h-4 w-4" />,
      templates: [
        "Requesting immediate backup at location",
        "Suspect spotted, need assistance",
        "Emergency situation reported at scene",
        "Medical emergency, ambulance required",
      ],
    },
    {
      category: "Status Updates",
      icon: <Shield className="h-4 w-4" />,
      templates: [
        "Situation under control",
        "Area secured, proceeding with investigation",
        "Patrol completed, no incidents to report",
        "Evidence collected and documented",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex rounded-lg overflow-hidden border">
      {/* Users List */}
      <div
        className={`w-80 bg-white border-r ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
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
              placeholder="Search officers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          {filteredUsers.map((user) => (
            <div key={user.id} onClick={() => handleUserSelect(user)}>
              {user.phone != cookies.phone && (
                <div 
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b ${
                    selectedUser?.id === user.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {user.name}
                        {user.hasExistingChat && user.unreadCount > 0 && (
                          <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {user.unreadCount}
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500">{user.time}</span>
                    </div>
                    <p className={`text-sm ${user.hasExistingChat && user.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'} truncate`}>
                      {user.lastMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {selectedUser ? (
        <div className="flex-1 flex flex-col">
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
              <p className="text-sm text-gray-500">{selectedUser.role}</p>
              <p className="text-xs text-gray-400">{selectedUser.station}</p>
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

          <ScrollArea className="flex-1 p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {msg.type === "file" ? (
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <span>{msg.content}</span>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <span
                      className={`text-xs ${
                        msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                      } float-right ml-2`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

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
                      onClick={() => handleFileUpload("image")}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleFileUpload("document")}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleFileUpload("*")}
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
                onKeyPress={(e) =>
                  e.key === "Enter" && !sending && handleSendMessage()
                }
                disabled={sending}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={sending || !message.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-600">
              Welcome to Police Department Chat
            </h2>
            <p className="text-gray-500">
              Select an officer to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
