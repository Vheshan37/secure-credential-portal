"use client";

import { MdBlock, MdDoneAll } from "react-icons/md";
import { LiaHourglassEndSolid } from "react-icons/lia";
import Request from "../guest/request";
import RequestForm from "./requestForm";
import SystemCredential from "./systemCredential";
import { useEffect, useState } from "react";

export default function GuestPanel({ user }) {
  const [requests, setRequests] = useState([
    {
      circuitId: "E321654",
      date_time: "2025-05-05 07:30 AM",
      status: "pending",
      message:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam mollitia placeat laborum nisi ipsam, minus reprehenderit inventore doloremque quod? Saepe iusto vel assumenda quae porro?",
    },
  ]);

  useEffect(async () => {
    const res = await fetch(`/api/user/requestHistory?id=${user.userId}`);

    const data = await res.json();

    if (res.ok) {
      if (data.success) {
        setRequests(data.requests);
      } else {
        alert(data.error);
      }
    } else {
      alert(data.error);
    }
  }, []);

  return (
    <div className="p-4 h-screen w-full flex flex-col overflow-hidden">
      {/* Top Header - Fixed height */}
      <div className="border-b pb-2 border-gray-300">
        <h1 className="text-green-600 text-xl font-semibold">Guest Panel</h1>
      </div>

      {/* Main Content - Flex grow with overflow */}
      <div className="flex-1 min-h-0 w-full py-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Request Form - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3 border border-gray-300 rounded-lg shadow-md p-4 flex flex-col min-h-0">
          <div className="text-green-600 font-semibold text-lg pb-2">
            Request Form
          </div>
          <div className="flex-1 overflow-y-auto">
            <RequestForm user={user} />
          </div>
        </div>

        {/* Right Column - Full width on mobile, 1/3 on desktop */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* Request History - Half height on desktop, auto on mobile */}
          <div className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col flex-1 min-h-0">
            <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
              Request History
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 mt-2">
              {requests.map((item) => (
                <Request
                  item={item}
                  icon={
                    item.status == "pending" ? (
                      <LiaHourglassEndSolid className="text-orange-400" />
                    ) : item.status == "completed" ? (
                      <MdDoneAll className="text-green-400" />
                    ) : (
                      <MdBlock className="text-red-400" />
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* System Credentials - Half height on desktop, auto on mobile */}
          <div className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col flex-1 min-h-0">
            <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
              System Credentials
            </div>
            <div className="flex-1 overflow-y-auto mt-2">
              <SystemCredential />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
