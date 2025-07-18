"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function UnauthorizedPage() {
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.to("#vector", {
      x: -5,
      rotation: -2,
      duration: 0.1,
      ease: "power1.inOut",
    })
      .to("#vector", {
        x: 5,
        rotation: 2,
        duration: 0.1,
        ease: "power1.inOut",
      })
      .to("#vector", {
        x: -5,
        rotation: -2,
        duration: 0.1,
        ease: "power1.inOut",
      })
      .to("#vector", {
        x: 0,
        rotation: 0,
        duration: 0.1,
        ease: "power1.inOut",
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      {/* Vector illustration */}
      <img
        id="vector"
        src="/images/unauthorized.svg"
        alt="Unauthorized Access"
        className="w-64 mb-8"
      />

      {/* Message */}
      <h1 className="text-4xl font-bold text-purple-500 mb-2">Access Denied</h1>
      <p className="text-gray-600 text-sm text-center max-w-md mb-6">
        You don’t have permission to access this page. If you believe this is a
        mistake, please contact your system administrator.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </main>
  );
}
