import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Cases from "./pages/cases/Cases";
import Reports from "./pages/reports/Reports";
import Chat from "./pages/chats/Chats";

const Dashboard = () => {
  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="cases" element={<Cases />} />
            <Route path="/" element={<Reports />} />
            <Route path="chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
  );
};

export default Dashboard;
