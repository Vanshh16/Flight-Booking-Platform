"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dot, User, UserCircle2, UserCircleIcon } from "lucide-react";
import { IoAirplaneSharp } from "react-icons/io5";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className={`fixed w-full z-50 shadow transition-colors duration-300 ${
        isScrolled
          ? "bg-black/30 backdrop-blur-lg "
          : "bg-transparent text-black"
      }`}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-2xl font-semibold">
            <Link href="/">
              {/* <img className="h-16 inline" src="/plane.jpg" /> */}
              FLIGHT BOOKER
              <Dot className="h-12 md:h-16 inline" />
              <Dot className="h-12 md:h-16 inline" />
              <Dot className="h-12 md:h-16 inline" />
              <Dot className="h-12 md:h-16 inline" />
              <IoAirplaneSharp className="h-12 md:h-16 inline" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 relative">
            <Link
              href="/"
              className="font-medium p-1 rounded-md hover:bg-black/30 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="font-medium p-1 rounded-md hover:bg-black/30 transition-colors"
            >
              ABOUT
            </Link>
            <Link
              href="/contact"
              className="font-medium p-1 rounded-md hover:bg-black/30 transition-colors"
            >
              CONTACT
            </Link>

            <div className="relative" ref={dropdownRef}>
              <UserCircle2
                className="cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 text-sm border z-50">
                  <Link
                    href="/wallet"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Wallet
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/50 backdrop-blur-2xl p-4 space-y-4 z-40">
            <Link href="/" className="block">
              Home
            </Link>
            <Link href="/about" className="block">
              About
            </Link>
            <Link href="/contact" className="block">
              Contact
            </Link>
            <Link href="/wallet" className="block">
              Wallet
            </Link>
            <Link href="/my-bookings" className="block">
              My Bookings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
