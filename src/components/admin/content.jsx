"use client";

import { useEffect, useState } from "react";
import Request from "./request";
import ResponseForm from "./responseForm";

export default function Content({ requestToggler, historyToggler }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/getRequests");
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 h-full w-full flex flex-col overflow-hidden">
      {/* Top */}
      <div className="border-b pb-2 border-gray-300">
        <span className="text-green-600 text-xl font-semibold">
          Admin Panel
        </span>
      </div>
      {/* Center */}
      <div className="h-full w-full p-4 flex gap-8">
        <div className="w-2/3 border border-gray-300 rounded shadow-md p-4 flex flex-col">
          <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
            Client Requests
          </div>
          <div className="my-2 h-full gap-4 flex flex-col overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-gray-500">No pending requests.</div>
            ) : (
              requests.map((req) => (
                <Request
                  key={req.id}
                  request={req}
                  className="shadow-md"
                  radioName="requestGroup"
                  requestToggler={() => requestToggler(req)}
                  historyToggler={() => historyToggler(req.user.email)}
                  isSelected={selectedRequest?.id === req.id}
                  onSelect={handleSelectRequest}
                />
              ))
            )}
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 rounded shadow-md p-4 flex flex-col">
          <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
            Send Response
          </div>
          <div className="my-2 h-full overflow-y-auto overflow-x-hidden">
            <ResponseForm
              request={selectedRequest}
              onResponseSubmitted={fetchRequests}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
