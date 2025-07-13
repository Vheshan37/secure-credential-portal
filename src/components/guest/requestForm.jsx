"use client";

import { sendRequest } from "@/actions/request";
import { useActionState, useState } from "react";
import { MdBlock } from "react-icons/md";
import EmailVerification from "./emailVerification";

export default function () {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const openVerification = () => {
    setIsVerificationOpen(true);
  };

  const closeVerification = () => {
    setIsVerificationOpen(false);
  };

  // The action to run in the popup:
  const [state, action, isPending] = useActionState(sendRequest, undefined);

  return (
    <>
      {isVerificationOpen && (
        <EmailVerification onClose={closeVerification} action={action} />
      )}
      <form className="flex gap-4 flex-col">
        <span className="text-gray-700 font-semibold border-b border-gray-300 pb-2">
          Personal Details
        </span>
        <div className="flex gap-2">
          {/* Name */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
          {/* Designation */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Designation
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex gap-2">
          {/* Email */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Email
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
          {/* Contact No */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Contact No
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
        </div>
        <span className="text-gray-700 font-semibold border-b border-gray-300 pb-2">
          Service Details
        </span>
        <div className="flex gap-2">
          {/* Circuit No */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Circuit No
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
          {/* Company */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Company
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder=""
            />
          </div>
        </div>
        {/* Service */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">
            Service
          </label>
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
            placeholder=""
          />
        </div>
        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">
            Description
          </label>
          <textarea
            rows={4}
            name=""
            id=""
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
          ></textarea>
          <span className="text-gray-600 text-xs mt-1">
            Your VPS request is sent to the administrator. If approved, your IT
            Manager receives a one-time code to grant you temporary access to
            view the security credentials.
          </span>
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={openVerification}
          className="mt-2 inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </>
  );
}
