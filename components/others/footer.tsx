import {
  IconBrandInstagram,
  IconBrandYoutube,
  IconLocation,
} from "@tabler/icons-react";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-btnblue text-white rounded-[48px_48px_0_0] md:rounded-[144px_144px_0_0] hidden md:block container m-auto">
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 justify-center m-auto text-center md:text-left">
            <div className="m-auto">
              <Link href="/" className="text-xl font-bold">
                <Image
                  src="/m_logo1.png"
                  alt="Milele Health"
                  className="pb-5"
                  width={80}
                  height={50}
                />
              </Link>
              <p className="text-sm text-white/80 w-32">
                Your most trusted haircare solution brand
              </p>
            </div>
            <div className="m-auto">
              <h3 className=" mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {/* <li>
                  <Link href="/analyze">Take the test</Link>
                </li> */}
                <li>
                  <Link href="/blogs">Blogs</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
                {/* <li>
                  <Link href="/technology">Our Technology</Link>
                </li> */}
              </ul>
            </div>
            <div className="m-auto">
              <h3 className=" mb-4">Popular links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How it works</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-conditions">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div className="text-sm text-white/80 space-y-2 m-auto grid grid-cols-2 justify-between gap-x-10 mt-5 md:block">
              <p className="flex gap-4 ">
                <IconLocation className="w-8 h-8" />
                Flat no 302, dhyan residency, mahadeshwara layout, btm 2nd stage
              </p>
              <p className="flex gap-4 ">
                <Phone className="w-4 h-4" /> 8861452659
              </p>
              <Link
                href={`https://www.instagram.com/mr.mardofficial`}
                target="_blank"
                className="flex gap-4 "
              >
                <IconBrandInstagram className="w-5 h-5" /> Instagram
              </Link>
              <Link
                href={`https://youtube.com/@mrmard_official?si=wWuuxQwTgVgOtnND`}
                target="_blank"
                className="flex gap-4 "
              >
                <IconBrandYoutube className="w-[18px] h-[18px]" /> Youtube
              </Link>
            </div>
          </div>
          <div className="bg-yellow py-4 md:mx-6 px-4 rounded-[144px] md:mt-20">
            <p className="text-[#1E2A4A] text-sm text-center">
              © {new Date().getFullYear()} Milele Health. All Rights Reserved.
              Made With ❤️ In India.
            </p>
          </div>
        </div>
      </footer>
      <footer className="bg-btnblue text-white rounded-[48px_48px_0_0] md:rounded-[144px_144px_0_0] md:hidden">
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="flex flex-col space-y-10 pb-16 ml-2">
            <div className="">
              <Link href="/" className="text-xl font-bold">
                <Image
                  src="/m_logo1.png"
                  className="pb-5"
                  alt="Milele Health"
                  width={80}
                  height={50}
                />
              </Link>
              <p className="text-sm text-white/80 ">
                Your most trusted haircare solution brand
              </p>
            </div>
            <div className="">
              <h3 className=" mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {/* <li>
                  <Link href="/report">Report</Link>
                </li> */}
                <li>
                  <Link href="/blogs">Blogs</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="">
              <h3 className=" mb-4">Popular links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How it works</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-conditions">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex gap-4 ">
                <IconLocation className="w-5 h-5" />
                Flat no 302, dhyan residency, mahadeshwara layout, btm 2nd stage
              </p>
              <p className="flex gap-4 ">
                <Phone className="w-4 h-4" /> 8861452659
              </p>
              <Link
                href={`https://www.instagram.com/mr.mardofficial`}
                target="_blank"
                className="flex gap-4 "
              >
                <IconBrandInstagram className="w-5 h-5" /> Instagram
              </Link>
              <Link
                href={`https://youtube.com/@mrmard_official?si=wWuuxQwTgVgOtnND`}
                target="_blank"
                className="flex gap-4 "
              >
                <IconBrandYoutube className="w-[18px] h-[18px]" /> Youtube
              </Link>
            </div>
          </div>
          <div className="bg-yellow py-4 md:mx-6 px-4 rounded-[144px] md:mt-20">
            <p className="text-[#1E2A4A] text-sm text-center">
              © {new Date().getFullYear()} Milele Health. All Rights Reserved.
              Made With ❤️ In India.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
