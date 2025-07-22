"use client";

import { useState, useEffect } from "react";
import { MdBlock } from "react-icons/md";
import Swalert from "sweetalert2";

export default function ResponseForm({ request, onResponseSubmitted }) {
  const [reject, setReject] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    itManagerEmail: "",
    itManagerMessage: "",
    userMessage: "",
    circuitNo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleReject = () => {
    setReject((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (request) {
      setFormData({
        username: "",
        password: "",
        itManagerEmail: "",
        itManagerMessage: "",
        userMessage: "",
        circuitNo: request.circuit_no,
      });
      setReject(false);
    }
  }, [request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!request) {
        throw new Error("No request selected");
      }

      // Validate required fields
      if (!reject && (!formData.username || !formData.password)) {
        throw new Error("Username and password are required");
      }

      if (!formData.itManagerEmail || !formData.itManagerMessage) {
        throw new Error("IT Manager email and message are required");
      }

      const response = await fetch("/api/admin/sendResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          requestId: request.id,
          isRejected: reject,
          status: reject ? "rejected" : "completed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit response");
      }

      // Reset form on success
      setFormData({
        username: "",
        password: "",
        itManagerEmail: "",
        itManagerMessage: "",
        userMessage: "",
        circuitNo: request?.circuit_no || "",
      });
      setReject(false);
      await Swalert.fire({
        title: "Success",
        text: reject
          ? "Request rejected successfully"
          : "Response sent successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      if (onResponseSubmitted) {
        await onResponseSubmitted();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button text based on state
  const getButtonText = () => {
    if (!request) return "Select a request first";
    if (isLoading) return reject ? "Rejecting..." : "Sending...";
    return reject ? "Reject Request" : "Send Response";
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
      <div className="flex items-center gap-2 text-red-600 justify-end px-2">
        <label
          onClick={toggleReject}
          className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition border 
            ${reject ? "border-red-600 bg-red-50" : "border-gray-300"}
            ${!request ? "opacity-50 cursor-not-allowed" : ""}
          `}
          style={{ pointerEvents: !request ? "none" : "auto" }}
        >
          <MdBlock size={16} />
          <span>Reject</span>
        </label>
      </div>

      {/* Circuit No */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">
          Circuit No
        </label>
        <input
          type="text"
          disabled
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          placeholder="E1002305"
          value={formData.circuitNo}
          onChange={handleChange}
        />
      </div>

      {/* Only show these fields if not rejecting */}
      {!reject && (
        <>
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              disabled={!request}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={!request}
            />
          </div>
        </>
      )}

      {/* IT Manager Email */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">
          IT Manager Email
        </label>
        <input
          type="email"
          name="itManagerEmail"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
          placeholder="manager@example.com"
          value={formData.itManagerEmail}
          onChange={handleChange}
          required
          disabled={!request}
        />
      </div>

      {/* IT Manager Message */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">
          {reject ? "Rejection Reason" : "IT Manager Message"}
        </label>
        <textarea
          name="itManagerMessage"
          rows="3"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none text-gray-900"
          placeholder={
            reject
              ? "Explain why this request is being rejected..."
              : "Write a message..."
          }
          value={formData.itManagerMessage}
          onChange={handleChange}
          required
          disabled={!request}
        ></textarea>
      </div>

      {/* User Message */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">
          User Message
        </label>
        <textarea
          name="userMessage"
          rows="3"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none text-gray-900"
          placeholder="Write a message to the user..."
          value={formData.userMessage}
          onChange={handleChange}
          disabled={!request}
        ></textarea>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!request || isLoading}
        className={`mt-2 inline-block font-medium px-4 py-2 rounded transition
          ${
            reject
              ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
              : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
          }
          ${!request ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400" : ""}
        `}
      >
        {getButtonText()}
      </button>
    </form>
  );
}
