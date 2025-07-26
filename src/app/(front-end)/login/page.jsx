"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useState } from "react";
import GuestLogin from "@/components/guestLogin";
import Swal from "sweetalert2";

export default function Login() {
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle the login process
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter both username and password",
        confirmButtonColor: "#3085d6",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to admin dashboard...",
          confirmButtonColor: "#3085d6",
          timer: 1500,
          showConfirmButton: false,
        });
        window.location.href = "/admin";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.error,
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

  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-b from-blue-900 to-green-900 relative overflow-hidden flex justify-center items-center">
        {/* Guest login popup */}
        {isGuestOpen && <GuestLogin onClose={toggleGuestPopup} />}
        {/* Guest login popup */}

        {/* Login form */}

        {/* Glassmorphic form container */}
        <form
          onSubmit={handleSubmit}
          className="relative w-1/2 z-10 max-w-sm p-6 rounded-2xl bg-white/5 backdrop-blur-sm  shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
            Secure Credential Portal
          </h1>

          <div className="bg-white/20 border-l-[1.5px] border-blue-600 rounded-lg p-3 text-sm text-slate-300 mb-4">
            Security Notice: This system contains sensitive information. All
            activities are logged and monitored.
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-slate-300 font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe@gmail.com"
              className="w-full p-2 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer text-slate-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 text-slate-300 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full p-2 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer text-slate-300"
            />
          </div>

          <p className="text-xs text-slate-300">
            By accessing this system, you agree to comply with all company
            policies including:
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xs mb-4 px-4 text-slate-400">
            <li>
              <a href="#" className="text-slate-400 underline">
                Acceptable Use Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 underline">
                Information Security Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 underline">
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
              Login as a User
            </button>
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
                "Login as Admin"
              )}
            </button>
          </div>
        </form>

        <img
          src="/images/background.png"
          alt="Image"
          className="w-1/2 h-full object-contain -z-0"
          id="img"
        />
      </div>
    </>
  );
}
