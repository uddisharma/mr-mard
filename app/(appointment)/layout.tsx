import Footer from "@/components/others/footer";
import Header from "@/components/others/header";
import React from "react";

export const metadata = {
  title: "Book Appointment",
  description: "Book Appointment",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2]">
      <Header />
      <div className="flex flex-col px-5 md:px-10">
        <main className="flex-1 md:px-4 md:py-10 w-full">
          <div className="flex justify-center gap-20 items-center mb-10">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
