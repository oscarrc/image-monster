import Footer from "./Footer";
import Header from "./Header";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] layout-grid min-h-screen max-h-auto md:max-h-screen bg-base-100">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 container mx-auto p-4 flex"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;
