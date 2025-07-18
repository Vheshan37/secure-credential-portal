"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";

export default function GuestLogin({ onClose }) {
  const formRef = useRef();
  const [email, setEmail] = useState("");
  const [circuitId, setCircuitId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/guestLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, circuitId }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.redirect) {
        // alert(data.redirect);
        window.location.href = data.redirect;
      } else {
        alert("OTP sent! Please check your email to verify.");
        // TODO: Redirect to an OTP verification page (/verify-otp)
      }
    } else {
      alert(data.error || "Something went wrong.");
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
      onComplete: () => {
        onClose();
      },
    });
  };

  return (
    <div className="absolute z-20 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <form
      onSubmit={handleSubmit}
        ref={formRef}
        className="bg-blue-50 rounded border border-gray-300 px-2 pt-2 pb-4 min-w-[350px]"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-semibold text-lg">Login as a User</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="" className="block mb-1 text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="" className="block mb-1 text-gray-600">
            Circuit No
          </label>
          <input
            type="text"
            placeholder="E10002345"
            onChange={(e)=>setCircuitId(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          />
        </div>
        <div className="mb-2 flex justify-start">
          <span className="text-sm text-gray-400 ps-1 pe-4 text-left">
            Your IP and email are used only for session authentication
          </span>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login as a User
          </button>
        </div>
      </form>
    </div>
  );
}
