"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/Grobotslogo.png";
import {
  Home,
  Users,
  Calendar,
  Trophy,
  CardSim,
  User,
  Info,
  Folder,
  Menu,
  X,
} from "lucide-react";
import PropTypes from "prop-types";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Team", href: "/team", icon: Users },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Feedback", href: "https://forms.gle/A1QPtgZPjrJBqyB29", icon: CardSim }
];

export default function Navbar({ className }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`w-full border-b border-gray-800 md:absolute md:bg-transparent bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50 font-sans ${
        className || ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-1 md:hover:opacity-80 md:transition-opacity"
          >
            <Image
              src={logo}
              alt="GROBOTS Logo"
              width={40}
              height={40}
              className="w-8 sm:w-10 md:w-12"
              priority
            />
            <span className="text-lg sm:text-xl font-bold text-white font-['Erode']">
              GROBOTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm lg:text-base font-medium md:transition-colors ${
                    isActive
                      ? "text-gray-100"
                      : "text-gray-600 md:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800 md:transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="py-3 px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium md:transition-colors ${
                      isActive
                        ? "bg-gray-200 text-black"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  className: PropTypes.string,
};
