"use client";

import RequestPopUp from "@/components/admin/requestPopup";
import Content from "@/components/admin/content";
import SideBar from "@/components/admin/sidebar";
import RequestHistory from "@/components/admin/userRequestHistory";
import { useState } from "react";

export default function AdminClient() {
  const [isRequestPopUpOpen, setIsRequestPopUpOpen] = useState(false);
  const [isRequestHistoryOpen, setIsRequestHistoryOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const toggleRequestPopUp = (request = null) => {
    setIsRequestPopUpOpen((prev) => !prev);
    setSelectedRequest(request);
  };

  const toggleRequestHistory = (email = null) => {
    setIsRequestHistoryOpen(!isRequestHistoryOpen);
    setSelectedEmail(email);    
  };

  return (
    <div className="w-screen h-screen flex bg-white overflow-hidden">
      <SideBar className="bg-gradient-to-b from-blue-900 to-green-900 w-fit p-4 h-full flex flex-col justify-center items-center shadow-lg shadow-gray-500 max-w-[300px]" />
      {/* Content */}
      <Content
        requestToggler={toggleRequestPopUp}
        historyToggler={toggleRequestHistory}
      />
      {isRequestPopUpOpen && (
        <RequestPopUp
          toggleComponent={toggleRequestPopUp}
          request={selectedRequest}
        />
      )}
      {isRequestHistoryOpen && (
        <RequestHistory toggleComponent={toggleRequestHistory} email={selectedEmail} />
      )}
    </div>
  );
}