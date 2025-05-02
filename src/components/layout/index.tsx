import Footer from "./footer";
import Header from "./header";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="grid grid-rows-3 layout-grid min-h-screen max-h-screen overflow-hidden bg-base-100">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 container mx-auto px-4 overflow-hidden"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;
