"use client";

import { useState } from "react";
import EmailVerification from "./emailVerification";

export default function ({ user }) {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [circuitId, setCircuitId] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");

  const openVerification = () => {
    setIsVerificationOpen(true);
  };

  const closeVerification = () => {
    setIsVerificationOpen(false);
  };

  const isInputsEntered = () => {
    const errors = [];

    if (name.trim() === "") errors.push("Name");
    if (designation.trim() === "") errors.push("Designation");
    if (contact.trim() === "") errors.push("Contact");
    if (circuitId.trim() === "") errors.push("Circuit ID");
    if (company.trim() === "") errors.push("Company");
    if (service.trim() === "") errors.push("Service");
    if (description.trim() === "") errors.push("Description");

    if (errors.length > 0) {
      alert(`The following fields cannot be empty:\n${errors.join(", ")}`);
      return false;
    }

    return true;
  };

  const clearInputs = () => {
    setName("");
    setDesignation("");
    setContact("");
    setCircuitId("");
    setCompany("");
    setService("");
    setDescription("");
  };

  const submitRequest = async () => {
    const res = await fetch("/api/user/request/sendRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.userId,
        name,
        designation,
        contact,
        company,
        service,
        description,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.success) {
        alert(data.message);
        clearInputs();
        closeVerification();
      } else {
        alert(data.error);
      }
    } else {
      alert(data.error);
    }
  };

  const verifyAndSendMail = async () => {
    if (isInputsEntered()) {
      const response = await fetch(
        `/api/user/request/sendEmail?id=${encodeURIComponent(user.userId)}`
      );

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success) {
          alert(responseData.message);
          openVerification();
        } else {
          alert(responseData.error);
        }
      } else {
        alert(responseData.error);
      }
    }
  };

  return (
    <>
      {isVerificationOpen && (
        <EmailVerification
          onClose={closeVerification}
          onAction={submitRequest}
          user={user}
        />
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
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
            />
          </div>
          {/* Designation */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
              disabled
              value={user.email}
            />
          </div>
          {/* Contact No */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Contact No
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
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
              value={circuitId}
              onChange={(e) => {
                setCircuitId(e.target.value);
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
            />
          </div>
          {/* Company */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
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
            value={service}
            onChange={(e) => {
              setService(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
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
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600"
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
          onClick={verifyAndSendMail}
          className="mt-2 inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </>
  );
}
