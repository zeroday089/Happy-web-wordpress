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

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-6">
          Happy Ho (&ldquo;Happy Ho&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;
          or &ldquo;us&rdquo;) respects and values the privacy and
          confidentiality of its clients and users.
        </motion.p>

        <motion.p variants={itemVariants} className="mb-8">
          By using our website, booking sessions, or availing services, you
          consent to the collection and use of information in accordance with
          this Privacy Policy.
        </motion.p>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information Collected
          </h2>

          <p className="mb-3">Happy Ho may collect:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Contact information</li>
            <li>Email address</li>
            <li>Payment information</li>
            <li>Booking details</li>
            <li>
              Wellness-related information voluntarily shared by clients
            </li>
            <li>Other information necessary for providing services</li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Use of Information
          </h2>

          <p className="mb-3">Information collected may be used for:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Scheduling sessions</li>
            <li>Service delivery</li>
            <li>Customer support</li>
            <li>Operational purposes</li>
            <li>Communication regarding bookings and services</li>
            <li>Internal administration</li>
            <li>Legal or regulatory compliance where required</li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Confidentiality
          </h2>

          <p className="mb-4">
            Happy Ho endeavours to maintain confidentiality of client
            information shared during sessions.
          </p>

          <p className="mb-3">
            Facilitators associated with Happy Ho are expected to maintain
            strict confidentiality regarding client information and shall not
            disclose such information to unauthorised third parties except:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>With client consent</li>
            <li>Where legally required</li>
            <li>
              Where necessary for operational purposes connected with service
              delivery
            </li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>

          <p className="mb-4">
            Happy Ho takes reasonable administrative and technical measures to
            safeguard client information.
          </p>

          <p className="mb-3">However, clients acknowledge that:</p>

          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Online platforms</li>
            <li>Digital communications</li>
            <li>Internet-based transmissions</li>
          </ul>

          <p>
            may involve inherent security risks beyond complete control.
            Accordingly, Happy Ho does not guarantee absolute data security.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Third-Party Platforms
          </h2>

          <p>
            Payments and certain communications may be processed through
            third-party platforms or payment gateways. Happy Ho shall not be
            responsible for the privacy practices, technical failures, or
            policies of such third-party service providers.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Testimonials &amp; Media
          </h2>

          <p>
            Any testimonial, review, feedback, photograph, audio recording, or
            video voluntarily shared with Happy Ho may be used for promotional,
            branding, website, educational, or social media purposes unless the
            client withdraws consent in writing.
          </p>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">
            7. Policy Updates
          </h2>

          <p>
            Happy Ho reserves the right to modify or update this Privacy Policy
            from time to time without prior notice. Continued use of services
            after such updates shall constitute acceptance of the revised
            policy.
          </p>
        </motion.section>
      </motion.main>
    </>
  );
}