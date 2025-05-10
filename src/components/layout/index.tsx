import Footer from "./Footer";
import Header from "./Header";
import { ReactNode } from "react";

const Layout = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] layout-grid min-h-screen max-h-auto md:max-h-screen bg-base-100">
      <Header />

      <main className={`flex-1 container mx-auto p-4 flex ${className}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
