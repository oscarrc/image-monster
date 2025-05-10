import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { IoArrowBackOutline } from "react-icons/io5";
import { PiGithubLogoFill } from "react-icons/pi";
import { SiKofi } from "react-icons/si";
import logo from "@/assets/logo.svg";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Track scroll position for header animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-base-100 shadow-md" : "bg-base-100/80 backdrop-blur-sm"
      }`}
    >
      <nav className="navbar container mx-auto px-4 h-16">
        <div className="flex-1">
          <div className="flex gap-2 items-center text-2xl text-primary">
            <img src={logo} alt="Logo" className="h-auto w-10" />
            <span>
              Image<span className="font-bold">Monster</span>
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-none">
          {!isHomePage && (
            <Link
              to="/"
              className="btn btn-ghost btn-circle"
              aria-label="Back to home"
            >
              <IoArrowBackOutline className="h-5 w-5" />
            </Link>
          )}
          <a
            href="https://github.com/oscarrc/image-monster"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <PiGithubLogoFill className="h-6 w-6" />
          </a>
          <a
            href="https://ko-fi.com/oscarrc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <SiKofi className="h-6 w-6" />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
