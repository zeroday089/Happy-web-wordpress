"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function RefundPolicyPage() {
  const router = useRouter();

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push("/")}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md hover:shadow-lg hover:bg-gray-200 cursor-pointer transition-all"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </motion.button>

      <motion.main
        className="max-w-4xl mx-auto px-4 mt-8 md:px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold mb-8"
        >
          Refund Policy
        </motion.h1>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. General Policy
          </h2>

          <p className="mb-4">
            Fees paid towards consultations, coaching sessions, healing
            sessions, workshops, retreats, Vastu consultations, or allied
            wellness services are generally non-refundable.
          </p>

          <p>
            By proceeding with payment, the client acknowledges and agrees to
            this Refund Policy.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Exceptional Circumstances
          </h2>

          <p>
            Refund requests arising from exceptional circumstances may be
            reviewed on a case-by-case basis solely at the discretion of Happy
            Ho management.
          </p>

          <p className="mt-4">
            Submission of a refund request does not guarantee approval.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Non-Refundable Situations
          </h2>

          <p className="mb-3">
            Refunds shall ordinarily not be granted in cases involving:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Completed sessions</li>
            <li>Partially attended sessions</li>
            <li>Missed appointments</li>
            <li>Dissatisfaction based on subjective expectations</li>
            <li>Late cancellations</li>
            <li>Failure to follow facilitator guidance</li>
            <li>Refusal to continue services after commencement</li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Processing of Approved Refunds
          </h2>

          <p className="mb-3">
            Where a refund is approved by Happy Ho:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              The refund may be processed within a reasonable time
            </li>
            <li>
              Applicable payment gateway deductions or administrative
              charges may be adjusted
            </li>
            <li>
              Timelines may vary depending upon banking or payment gateway
              processes
            </li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">
            5. Right to Refuse Refund
          </h2>

          <p className="mb-3">
            Happy Ho reserves the right to refuse refund requests where it
            reasonably believes:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Services were duly offered or rendered</li>
            <li>Policies were violated</li>
            <li>
              The refund request is unreasonable, abusive, or contrary to
              applicable terms
            </li>
          </ul>
        </motion.section>
      </motion.main>
    </>
  );
}