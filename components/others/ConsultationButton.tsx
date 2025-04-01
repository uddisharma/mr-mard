"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ConsultationButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setShowButton(
        scrollPosition > 500 &&
          scrollPosition + windowHeight < documentHeight - 500,
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showButton && (
        <div className="fixed bottom-0 left-0 w-full bg-white py-3">
          <Link href="/appointment-booking">
            <div className="mx-auto w-max bg-black text-white px-20 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition duration-300">
              Book Consultation
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default ConsultationButton;
