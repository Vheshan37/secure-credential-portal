"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import Swal from "sweetalert2";

export default function OTPVerification({
  email,
  circuitId,
  onClose,
  onVerify,
}) {
  const formRef = useRef();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a complete 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, circuitId, otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.success) {
          await Swal.fire({
            icon: "success",
            title: "OTP Verified",
            text: "You have successfully logged in.",
            confirmButtonColor: "#3085d6",
            timer: 1500,
            showConfirmButton: false,
          });
          onVerify(data.token);
        } else {
          setError(data.error || "OTP verification failed");
        }
      } else {
        setError(data.error || "Request failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during verification");
      setIsLoading(false);
    }
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
      onComplete: onClose,
    });
  };

  return (
    <div className="absolute z-30 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="bg-blue-50 rounded border border-gray-300 px-4 pt-4 pb-6 min-w-[350px]"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
          <span className="font-semibold text-lg">Verify OTP</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            We've sent a 6-digit OTP to {email}
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp${index + 1}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
