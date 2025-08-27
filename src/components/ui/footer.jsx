import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialMediaLinks = [
    // {
    //   icon: <Facebook size={20} />,
    //   href: "https://facebook.com",
    //   label: "Facebook",
    //   color: "hover:bg-blue-500",
    // },
    // {
    //   icon: <Twitter size={20} />,
    //   href: "https://twitter.com",
    //   label: "Twitter",
    //   color: "hover:bg-blue-400",
    // },
    // {
    //   icon: <Linkedin size={20} />,
    //   href: "https://linkedin.com",
    //   label: "LinkedIn",
    //   color: "hover:bg-blue-600",
    // },
    {
      icon: <Instagram size={20} />,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-pink-500",
    },
  ];

  return (
    <footer className="bg-black text-gray-100 border-t border-gray-800 mt-14 font-sans">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-12 lg:p-16 rounded-t-3xl">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-neutral-500">Innovate :</span> <br />
            <span className="text-white">Create ;</span> <br />
            <span className="text-neutral-500">Dominate :)</span>
          </h1>
        </div>

        <div className="flex flex-col max-w-md text-center md:text-left md:mr-10 lg:mr-20">
          <p className="text-base md:text-lg mb-6 leading-relaxed text-gray-300">
            Experience robotics like never before with Grobots.
            <br className="hidden md:block" />
            Join our community of innovators and creators to
            <br className="hidden md:block" />
            explore the future of technology together.
          </p>

          <button
            className="bg-button border border-gray-300 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg transition-all duration-300 w-fit mx-auto md:mx-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Join Us Now"
          >
            Join Us Now
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Brand Name */}
      <div className="relative px-6 md:px-12 lg:px-16 overflow-hidden flex items-center justify-center">
        <span className="text-[20vw] font-bold font-sans">GROBOTS</span>
      </div>

      <hr className="border-gray-800 mx-6 md:mx-12 lg:mx-16" />

      {/* Social Media & Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 lg:px-16 py-6 md:py-10">
        <div className="flex gap-4 md:gap-6 mb-6 md:mb-0">
          {socialMediaLinks.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={`w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${item.color} hover:scale-110 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black`}
            >
              {item.icon}
            </a>
          ))}
        </div>

        <p className="text-sm text-gray-400 text-center md:text-left">
          © {currentYear} Grobots. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
