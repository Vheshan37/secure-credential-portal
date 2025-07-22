"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

export default function SystemCredential() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasValidSession, setHasValidSession] = useState(false);
  const firstInputRef = useRef(null);

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp${index + 2}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp${index}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user/getCredentials", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Only set credentials if we have actual values
          if (data.username && data.password && 
              data.username !== "N/A" && data.password !== "N/A") {
            setCredentials({
              username: data.username,
              password: data.password,
            });
            setHasValidSession(true);
          } else {
            // Clear any invalid session flags
            setHasValidSession(false);
          }
        } else {
          setHasValidSession(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        setHasValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const getSystemCredentials = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a complete 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/getCredentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.success) {
          // Verify we have actual credentials before setting session
          if (data.username && data.password && 
              data.username !== "N/A" && data.password !== "N/A") {
            setCredentials({
              username: data.username,
              password: data.password,
            });
            setHasValidSession(true);
            setOtp(["", "", "", "", "", ""]);
            
            await Swal.fire({
              icon: "success",
              title: "Success",
              text: "Credentials retrieved successfully",
              confirmButtonColor: "#3085d6",
              timer: 1500,
            });
          } else {
            setError("No valid credentials found");
          }
        } else {
          setError(data.error || "Failed to verify OTP");
        }
      } else {
        setError(data.error || "Request failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while fetching credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear client-side state
      setCredentials({ username: "", password: "" });
      setHasValidSession(false);
      
      // Optionally call an API endpoint to clear server-side session
      await fetch("/api/user/clearCredentials", {
        method: "DELETE",
        credentials: "include",
      });
      
      await Swal.fire({
        icon: "success",
        title: "Session Cleared",
        text: "Your credentials have been cleared",
        confirmButtonColor: "#3085d6",
        timer: 1500,
      });
    } catch (err) {
      console.error("Logout error:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to clear session",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hasValidSession ? (
        <>
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                readOnly
                value={credentials.username}
                className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-900 font-mono"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="text"
                readOnly
                value={credentials.password}
                className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-900 font-mono"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 text-center">
            These credentials will be available for 6 hours from verification.
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded py-2 px-4 transition-colors"
          >
            Clear Credentials
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">OTP Code</label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp${index + 1}`}
                  ref={index === 0 ? firstInputRef : null}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-900 w-12 text-center font-semibold"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit OTP you received to decrypt your credentials.
            </p>
          </div>

          <button
            onClick={getSystemCredentials}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
}