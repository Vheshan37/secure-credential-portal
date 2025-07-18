"use client";

import { useState } from "react";
import { MdBlock } from "react-icons/md";

export default function () {
  const [reject, setReject] = useState(false);

  const toggleReject = () => {
    setReject((prev) => !prev);
  };

  return (
    <form className="flex gap-4 flex-col">
      <div className="flex items-center gap-2 text-red-600 justify-end px-2">
        <label
          htmlFor=""
          onClick={toggleReject}
          className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition border 
          ${reject ? "border-red-600 bg-red-50" : "border-gray-300"}
        `}
        >
          <MdBlock size={16} />
          <span>Reject</span>
        </label>
        <input type="radio" name="" id="" hidden />
      </div>

      {/* Circuit No */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">Circuit No</label>
        <input
          type="text"
          disabled
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          placeholder="E1002305"
        />
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">Username</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
          placeholder="Enter your username"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">Password</label>
        <input
          type="password"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
          placeholder="Enter your password"
        />
      </div>

      {/* IT Manager Email */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">IT Manager Email</label>
        <input
          type="email"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900"
          placeholder="manager@example.com"
        />
      </div>

      {/* IT Manager Message */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">IT Manager Message</label>
        <textarea
          rows="3"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none text-gray-900"
          placeholder="Write a message..."
        ></textarea>
      </div>

      {/* User Message */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-600">User Message</label>
        <textarea
          rows="3"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none text-gray-900"
          placeholder="Write a message..."
        ></textarea>
      </div>

      {/* Submit button */}
      <button
        type="button"
        className="mt-2 inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send
      </button>
    </form>
  );
}
