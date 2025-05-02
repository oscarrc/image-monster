import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { PiGithubLogoFill } from "react-icons/pi";
import { SiKofi } from "react-icons/si";
import logo from "@/assets/logo.svg";
import { motion } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

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
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 h-16 ${
        scrolled ? "bg-base-100 shadow-md" : "bg-base-100/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="navbar container mx-auto px-4 h-full">
        <div className="flex-1">
          <Link to="/">
            <div className="flex gap-2 items-center text-2xl text-primary">
              <motion.img
                src={logo}
                alt="Logo"
                className="h-auto w-10"
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
              <span>
                Image<span className="font-bold">Monster</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex gap-2 flex-none">
          <a
            href="https://github.com/username/image-monster"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <PiGithubLogoFill className="h-6 w-6" />
          </a>
          <a
            href="https://ko-fi.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <SiKofi className="h-6 w-6" />
          </a>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
