"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Admin from "../admin/page";
import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "@/actions/auth";
import GuestLogin from "@/components/guestLogin";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined);
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const toggleGuestPopup = () => {
    setIsGuestOpen(!isGuestOpen);
  };

  useGSAP(() => {
    gsap.to("#img", {
      y: 20,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);
  return (
    <>
      <div className="h-screen w-screen bg-blue-50 relative overflow-hidden flex justify-center items-center">
        {/* Guest login popup */}
        {isGuestOpen && <GuestLogin onClose={toggleGuestPopup}/>}
        {/* Guest login popup */}

        <img
          src="/images/background.png"
          alt="Image"
          className="w-full h-full absolute object-contain -z-0"
          id="img"
        />

        {/* Login form */}

        {/* Glassmorphic form container */}
        <form
          action={action}
          className="relative z-10 w-full max-w-sm p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/40 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
            Secure Credential Portal
          </h1>

          <div className="bg-white border-l-[1.5px] border-blue-600 rounded-lg p-3 text-sm text-gray-800 mb-4">
            Security Notice: This system contains sensitive information. All
            activities are logged and monitored.
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-gray-900 font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="email"
              placeholder="johndoe@gmail.com"
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 text-gray-900 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            />
          </div>

          <p className="text-xs text-gray-900">
            By accessing this system, you agree to comply with all company
            policies including:
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xs mb-4 px-4">
            <li>
              <a href="#" className="text-gray-600 underline">
                Acceptable Use Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 underline">
                Information Security Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 underline">
                Data Protection Regulations
              </a>
            </li>
          </ul>

          <div className="flex gap-4">
            <button
              onClick={toggleGuestPopup}
              type="button"
              className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-700 hover:border-blue-700 hover:text-white cursor-pointer"
            >
              Login as a guest
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700  cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
