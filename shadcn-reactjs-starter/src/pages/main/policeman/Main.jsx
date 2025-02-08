import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Cases from "./pages/cases/Cases";
import Reports from "./pages/reports/Reports";
import Chat from "./pages/chats/Chats";
import Dashboard from "./pages/dashboard/Dashboard";
import Evidence from "./pages/evidence/Evidence";
import Personal from "./pages/personnel/Personal";
import DutyRoster from "./pages/roster/DutyRoster";
import Alert from "./pages/alert/Alert";
const Dashboard = () => {
  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="cases" element={<Cases />} />
            <Route path="/" element={<Reports />} />
            <Route path="chat" element={<Chat />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="personnel" element={<Personal />} />
            <Route path="roster" element={<DutyRoster />} />
            <Route path="alert" element={<Alert />} />

          </Routes>
        </div>
      </div>
  );
};

export default Dashboard;
