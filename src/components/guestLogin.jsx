"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import OTPVerification from "./guest/loginVerification";
import Swal from "sweetalert2";

export default function GuestLogin({ onClose }) {
  const formRef = useRef();
  const [email, setEmail] = useState("");
  const [circuitId, setCircuitId] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingCircuitId, setPendingCircuitId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/guestLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, circuitId }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.redirect) {
          await Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Redirecting to user dashboard...",
            confirmButtonColor: "#3085d6",
            timer: 1500,
            showConfirmButton: false,
          });
          window.location.href = data.redirect;
        } else {
          setPendingEmail(email);
          setPendingCircuitId(circuitId);
          setShowOTP(true);
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.error || "Something went wrong.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to connect to the server",
        confirmButtonColor: "#3085d6",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySuccess = (token) => {
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
    window.location.href = "/user";
  };

  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, []);

  const handleClose = () => {
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

  return (
    <div className="absolute z-20 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      {showOTP ? (
        <OTPVerification
          email={pendingEmail}
          circuitId={pendingCircuitId}
          onClose={() => setShowOTP(false)}
          onVerify={handleVerifySuccess}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="bg-white/10 backdrop-blur-lg  shadow-lg rounded px-2 pt-2 pb-4 min-w-[350px]"
        >
          <div className="text-slate-300 flex justify-between items-center pb-2 mb-4">
            <span className="font-semibold text-lg">Login as a User</span>
            <AiOutlineCloseSquare
              onClick={handleClose}
              size={24}
              className="cursor-pointer"
              color="white"
            />
          </div>
          <div className="px-2">
            <div className="flex flex-col mb-2">
              <label htmlFor="" className="block mb-1 text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text text-slate-200"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="" className="block mb-1 text-slate-300">
                Circuit No
              </label>
              <input
                type="text"
                placeholder="E10002345"
                onChange={(e) => setCircuitId(e.target.value)}
                className="w-full p-2 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-200"
              />
            </div>
            <div className="mb-2 flex justify-start">
              <span className="text-sm text-gray-800 ps-1 pe-4 text-left">
                Your IP and email are used only for session authentication
              </span>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex justify-center items-center ${
                  isLoading ? "opacity-75" : ""
                }`}
              >
                {isLoading ? (
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
                    Processing...
                  </>
                ) : (
                  "Login as a User"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
