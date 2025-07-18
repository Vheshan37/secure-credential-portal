"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";

export default function EmailVerification({ onClose, onAction, user }) {
  const formRef = useRef();
  const [otp, setOtp] = useState("");

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

  const handleOnAction = async (e) => {
    // otp validation part
    const res = await fetch("/api/user/request/checkOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.userId, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.success) {
        alert(data.message);
        onAction(); // request submit method
      } else {
        alert(responseData.error);
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <form
        ref={formRef}
        className="bg-blue-50 rounded border border-gray-300 px-2 pt-2 pb-4 min-w-[350px]"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-semibold text-lg">Verify Email</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="" className="block mb-1 text-gray-600">
            OTP code
          </label>
          <input
            type="text"
            placeholder="OTP code"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleOnAction}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Confirm & Submit
          </button>
        </div>
      </form>
    </div>
  );
}
