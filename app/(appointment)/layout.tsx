import AnalyticsIllustration from "@/components/others/analytics-illustrations";
import Footer from "@/components/others/footer";
import Header from "@/components/others/header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2]">
      <Header />
      <div className="flex flex-col px-5 md:px-10 my-2 mb-20 md:mb-0 md:py-10">
        <main className="flex-1 md:px-4 md:py-12 w-full">
          <div className="flex justify-center gap-20 items-center">
            {/* <div>
              <AnalyticsIllustration />
            </div> */}
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
