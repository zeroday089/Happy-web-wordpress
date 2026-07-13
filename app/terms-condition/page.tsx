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

export default function TermsAndConditionsPage() {
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
          Terms & Conditions
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-6">
          These Terms & Conditions ("Terms") govern the access to, booking of
          and participation in any consultation, coaching session, healing
          session, meditation, tarot consultation, Vastu consultation,
          workshop, retreat or allied wellness service offered through Happy Ho
          ("Happy Ho", "we", "our" or "us").
        </motion.p>

        <motion.p variants={itemVariants} className="mb-8">
          By accessing the website, booking a session, making payment or
          availing any service offered through Happy Ho, the client ("Client",
          "you" or "your") agrees to be legally bound by these Terms &
          Conditions.
        </motion.p>

        {/* Section 1 */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Services</h2>

          <p className="mb-3">
            Happy Ho provides wellness-related services including but not
            limited to:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Coaching</li>
            <li>Meditation</li>
            <li>Healing</li>
            <li>Tarot</li>
            <li>Vastu consultations</li>
            <li>Emotional wellbeing sessions</li>
            <li>Resilience-building programs</li>
            <li>Workshops</li>
            <li>Retreats</li>
            <li>Allied wellness services</li>
          </ul>

          <p className="mb-4">
            Happy Ho operates as a platform facilitating interaction between
            Clients and independent facilitators, coaches, healers and wellness
            professionals.
          </p>

          <p>
            Happy Ho reserves the right, at its sole discretion, to modify
            service structures, revise pricing, alter session formats, update
            policies, discontinue services, change facilitators, refuse
            bookings, or suspend operations temporarily or permanently without
            prior notice where reasonably required for operational,
            administrative, commercial or legal purposes.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>

          <p className="mb-3">
            By accessing or using Happy Ho services, the Client confirms that:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              He/She is legally competent to enter into binding agreements.
            </li>
            <li>
              All information provided is accurate, complete and current.
            </li>
            <li>
              Participation in services is voluntary and at the Client's own
              discretion.
            </li>
          </ul>

          <p>
            Happy Ho reserves the right to refuse access where incorrect
            information has been provided, services are misused, or
            participation may adversely affect facilitators, operations or
            other clients.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Bookings and Payments
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Bookings are confirmed only after successful payment receipt.
            </li>
            <li>
              Clients must provide accurate billing and payment information.
            </li>
            <li>
              Pricing, packages and promotional offers may change without
              notice.
            </li>
            <li>
              Applicable taxes and payment gateway charges may apply.
            </li>
            <li>
              Happy Ho is not responsible for payment failures, banking
              interruptions or third-party gateway issues.
            </li>
          </ul>
        </motion.section>

        {/* Section 4 */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Rescheduling, Cancellation and Refunds
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Payments are generally non-refundable.</li>
            <li>
              Rescheduling requests should preferably be made at least 24 hours
              before the session.
            </li>
            <li>
              Late arrivals, missed sessions, inappropriate behaviour or
              cancellations within 24 hours may result in forfeiture of the
              session.
            </li>
            <li>
              Exceptional refund requests are reviewed solely at Happy Ho's
              discretion.
            </li>
          </ul>
        </motion.section>

        {/* Section 5 */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Client Conduct
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Clients must behave respectfully and professionally.</li>
            <li>
              Abuse, harassment, threats, discrimination and unlawful conduct
              are prohibited.
            </li>
            <li>
              Services may be suspended or terminated without refund for
              violations of these Terms.
            </li>
          </ul>
        </motion.section>

        {/* Sections 6-14 */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              6. Confidentiality and Recording Restrictions
            </h2>
            <p>
              Clients may not record, reproduce, publish, distribute or
              commercially exploit any session content without prior written
              consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All trademarks, branding, materials, recordings and content
              remain the exclusive property of Happy Ho unless otherwise
              stated.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              8. Third-Party Platforms and Technical Limitations
            </h2>
            <p>
              Happy Ho is not liable for disruptions caused by internet
              failures, technical issues, power outages or third-party
              platforms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Rights
            </h2>
            <p>
              Use of Happy Ho services creates no employment, partnership,
              agency or fiduciary relationship.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnity</h2>
            <p>
              Clients agree to indemnify Happy Ho against claims, losses,
              damages and liabilities arising from misuse of services or breach
              of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              11. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms are governed by the laws of India. Disputes shall be
              subject to the exclusive jurisdiction of courts in Noida/Delhi
              NCR.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              12. Modification of Terms
            </h2>
            <p>
              Happy Ho may revise these Terms from time to time. Continued use
              of services constitutes acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
            <p>
              If any provision is held invalid or unenforceable, the remaining
              provisions shall remain in full force and effect.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              14. Acceptance of Terms
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Has read and understood these Terms & Conditions.</li>
              <li>Voluntarily agrees to comply with them.</li>
              <li>Agrees to be legally bound by these provisions.</li>
            </ul>
          </div>
        </motion.section>
      </motion.main>
    </>
  );
}