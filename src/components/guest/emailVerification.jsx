"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import Swalert from "sweetalert2";

export default function EmailVerification({ onClose, onAction, user, isLoading }) {
  const formRef = useRef();
  const inputRef = useRef();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
      }
    );
  }, []);

  const handleClose = () => {
    if (isVerifying || isLoading) return; // Prevent closing during verification
    
    gsap.to(formRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        onClose();
      },
    });
  };

  const handleOnAction = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      await Swalert.fire({
        icon: "warning",
        title: "OTP Required",
        text: "Please enter the OTP code",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const res = await fetch("/api/user/request/checkOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.userId, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.success) {
          await Swalert.fire({
            icon: "success",
            title: "OTP Verified",
            text: data.message,
            confirmButtonColor: "#3085d6",
            timer: 1500,
            showConfirmButton: false
          });
          onAction(); // request submit method
        } else {
          await Swalert.fire({
            icon: "error",
            title: "OTP Verification Failed",
            text: data.error,
            confirmButtonColor: "#d33",
          });
        }
      } else {
        await Swalert.fire({
          icon: "error",
          title: "Error",
          text: data.error,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      await Swalert.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to verify OTP",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <form
        onSubmit={handleOnAction}
        ref={formRef}
        className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-md relative"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isVerifying || isLoading}
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors ${
            isVerifying || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <AiOutlineCloseSquare size={24} />
        </button>

        <div className="text-green-600 border-b border-gray-200 pb-3 mb-4">
          <h2 className="font-semibold text-xl">Verify Email</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              ref={inputRef}
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isVerifying || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
            />
            <p className="text-xs text-gray-500">
              Check your email for the verification code
            </p>
          </div>

          <button
            type="submit"
            disabled={!otp || isVerifying || isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
              isVerifying || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isVerifying || isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isVerifying ? "Verifying..." : "Submitting..."}
              </>
            ) : (
              "Confirm & Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}