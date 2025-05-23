"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappIcon = () => {
  const pathname = usePathname();
  const [isPhone, setIsPhone] = React.useState(false);

  React.useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
      setIsPhone(true);
    }
  }, []);
  return (
    <>
      {!pathname.startsWith("/admin") && (
        <a
          href="https://wa.me/+918861452659?text=Hello%20Milele%20Health"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed md:bottom-10 bottom-20 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center z-50"
        >
          <FaWhatsapp size={30} />
        </a>
      )}
    </>
  );
};

export default WhatsappIcon;
