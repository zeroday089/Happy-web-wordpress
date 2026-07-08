"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FooterSmall() {
  // ================= Animations =================
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
  <motion.div
  className="bg-[#dcd8ce] xl:rounded-t-[110px] rounded-t-[40px] p-5 md:p-10 lg:p-16 mx-auto max-w-[1920px]"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  <motion.div className="flex flex-col gap-10" variants={fadeUp}>

    {/* Mobile Layout */}
    <div className="flex md:hidden gap-4">
      {/* Left: All 3 sections stacked vertically */}
      <div className="flex flex-col gap-6 flex-1">
        {/* About */}
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <strong className="text-[#544120] text-sm"><Link href="/AboutUs" className="cursor-pointer">About</Link></strong>
          <div className="flex flex-col text-[#544120] text-[13px]">
                        <span><Link href="/AboutUs" className="cursor-pointer">Founder’s Note</Link></span>
                        <span><Link href="/AboutUs#guides-section" className="cursor-pointer">
            Meet Our Guides
          </Link></span>
          </div>
        </motion.div>

        {/* Our Programs */}
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <strong className="text-[#544120] text-sm"><Link href="/Programs" className="cursor-pointer">Our Programs </Link></strong>
          <div className="flex flex-col text-[#544120] text-[13px]">
              <span><Link href="/Programs" className="cursor-pointer">For Individuals</Link></span>
              <span><Link href="/Corporate" className="cursor-pointer">For Organizations</Link></span>
              <span><Link href="/Programs" className="cursor-pointer">Signature Programs </Link></span>
            <div className="flex flex-col pl-4 text-[10px]">
              <span>• Cosmic Guidance</span>
              <span>• Meditation Coaching</span>
              <span>• Holistic Healing</span>
            </div>
          </div>
        </motion.div>

        {/* Content & Learning */}
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <strong className="text-[#544120] text-sm">Resources</strong>
          <div className="flex flex-col text-[#544120] text-[13px]">
                   <span><Link href="/Resources" className="cursor-pointer">Blog</Link></span>
            <span>Videos / Reels</span>
          </div>
        </motion.div>
      </div>

      {/* Right: Logo/Image only on mobile */}
      <div className="flex items-start justify-end">
          <div className="relative w-fit">

     
        <Image src="/footerImage.png" alt="Meditation" width={130} height={130} />
          {/* ® symbol */}
    <span className="absolute top-0 right-2 text-2xl font-bold">
      ®
    </span>
    <p className="text-center font-medium text-xs">Emotional & Mental Resilience Advisory</p>
         </div>

    {/* Contact Section */}
    <motion.div className="flex flex-col gap-2" variants={fadeUp}>
      <strong className="text-[#544120] text-lg lg:text-xl">Contact</strong>
      <div className="flex flex-col gap-5">
        <motion.div className="flex flex-col text-[#544120] text-[13px] lg:text-lg" variants={fadeUp}>
          <span>
            Address – Tower 7 – 202, Ace Parkway, <br />
            Sector 150, Gautam Budh Nagar, 201310,<br />
            NOIDA, Uttar Pradesh, India (Bharat)
          </span>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 text-[#544120] xl:grid-cols-2 md:gap-15 lg:gap-30" variants={fadeUp}>
          <div className="flex flex-col text-[13px] lg:text-lg">
            <span>Mobile: (+91) 9811237999</span>
            <span>Email: info@happyho.in</span>
          </div>
     <div className="flex flex-col gap-4 mt-5 lg:mt-0 lg:ml-auto">
  {/* Social Icons */}
  <div className="flex gap-3 items-center">
  {[
    {
      src: "/200.png",
      label: "FaceBook",
      href: "https://www.facebook.com/share/1dmyQaPUHq/",
    },
    {
      src: "/201.png",
      label: "Instagram",
      href: "https://www.instagram.com/happyho.in?igsh=azF6M214OGVwZGlx",
    },
    {
      src: "/202.png",
      label: "Twitter",
      href: "https://x.com/HappyHoWorld",
    },
    {
      src: "/203.png",
      label: "YouTube",
      href: "https://youtube.com/@happyhoindia?feature=shared",
    },
  ].map((item, i) => (
    <Link
      key={i}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={item.src}
        alt={item.label}
        width={100}
        height={60}
        className="w-10 h-10 lg:w-18 lg:h-18 object-contain cursor-pointer"
      />
    </Link>
  ))}
</div>

  {/* Policy Links */}
  <div className="grid grid-cols-2 text-[#544120] text-sm md:text-sm gap-1">
    <Link
      href="/privacy-policy"
      className="hover:underline cursor-pointer"
    >
      Privacy Policy
    </Link>

    <Link
      href="/refund-policy"
      className="hover:underline cursor-pointer"
    >
      Refund Policy
    </Link>

    <Link
      href="/terms-condition"
      className="hover:underline cursor-pointer"
    >
      Terms & Conditions
    </Link>
  </div>
</div>
        </motion.div>
      </div>
    </motion.div>

  </motion.div>
</motion.div>
  );
}