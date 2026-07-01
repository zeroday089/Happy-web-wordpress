"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BookingDetailsFormProps, BookingFormData, meditationSessionPricing, servicePricing, vastuSessionPricing } from "@/type/api";
import { toast } from "sonner";
import { SlotSelector } from "./Cal";
import { countryCodes, getCalLink } from "@/constants/calUrls";

export default function BookingDetailsForm({ guide, serviceName, session }: BookingDetailsFormProps) {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [showCal, setShowCal] = useState(false);
  const [paidBookingId, setPaidBookingId] = useState<string | null>(null);
  const [slotBooked, setSlotBooked] = useState(false);

  // Look up the Cal.com calLink for this guide + service
  const calLink = getCalLink(guide, serviceName);

  // paidBookingId ref — always up-to-date inside the onBooked callback
  const paidBookingIdRef = useRef<string | null>(null);
  paidBookingIdRef.current = paidBookingId;

  // Called by SlotSelector (Cal.com SDK) once a slot is confirmed
  const handleBooked = async ({ uid, startTime }: { uid: string; startTime: string }) => {
    const bookingId = paidBookingIdRef.current;
    if (!bookingId) return;

    toast.success("Slot booked successfully!");
    setShowCal(false);
    setSlotBooked(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/update-booking-slot`,
        {
          bookingId,
          calBookingUid: uid,
          calStartTime: startTime,
        }
      );
      console.log("UPDATE SLOT RESPONSE", response.data);
    } catch (err) {
      console.error("Failed to update booking slot:", err);
    }
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };
  const [form, setForm] = useState<BookingFormData>({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    selectedService: serviceName,  // ← pre-filled
    selectedGuide: guide,
    sessionType: "",
    concern: "",
    // preferredDateTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const paymentRef = useRef<HTMLDivElement>(null); const handleCreateOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!form.fullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!form.sessionType) {
      toast.error("Please select session type");
      return;
    }

    // =========================
    // PAYLOAD
    // =========================

    const payload = {
      fullName: form.fullName,

      email: form.email,

      phoneNumber:
        form.countryCode + form.phone,

      selectedService: serviceName,

      selectedGuide: guide,

      sessionType:
        form.sessionType === "online"
          ? "Online"
          : "Offline",

      // preferredDateTime:
      //   form.preferredDateTime,

      concernArea: form.concern,

      ...(session && { session }),
    };

    try {
      // =========================
      // CREATE ORDER
      // =========================

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
        { payload }
      );

      console.log(
        "CREATE ORDER RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        toast.error(
          "Payment initiation failed"
        );
        return;
      }

      // FIXED HERE
      const paymentData =
        response.data.data;

      // =========================
      // CHECK RAZORPAY SDK
      // =========================

      if (!(window as any).Razorpay) {
        toast.error(
          "Razorpay SDK failed to load"
        );
        return;
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================

      const options = {
        key: paymentData.key,

        amount: paymentData.amount,

        currency: paymentData.currency,

        name: "Your Business Name",

        description: "Booking Payment",

        order_id: paymentData.orderId,

        prefill: {
          name: form.fullName,

          email: form.email,

          contact:
            form.countryCode + form.phone,
        },

        theme: {
          color: "#6366f1",
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================

        handler: async (
          razorpayResponse: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }
        ) => {
          try {
            // console.log(
            //   "PAYMENT SUCCESS:",
            //   razorpayResponse
            // );

            // =========================
            // VERIFY PAYMENT
            // =========================

            const verifyResponse =
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
                {
                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                }
              );

            // console.log(
            //   "VERIFY RESPONSE:",
            //   verifyResponse.data
            // );

            if (
              verifyResponse.data.success
            ) {
              toast.success("Payment successful! Please Wait to Select Slot");
              setPaidBookingId(paymentData.bookingId);
              if (calLink) {
                setShowCal(true);
              }
            } else {
              toast.error(
                "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Verification Error:",
              error
            );

            toast.error(
              "Something went wrong during payment verification."
            );
          }
        },

        // =========================
        // PAYMENT FAILED
        // =========================

        modal: {
          ondismiss: () => {
            console.log(
              "Payment popup closed"
            );

            toast.info(
              "Payment cancelled"
            );
          },
        },
      };

      console.log(
        "RAZORPAY OPTIONS:",
        options
      );

      // =========================
      // OPEN RAZORPAY
      // =========================

      const rzp = new (
        window as any
      ).Razorpay(options);

      rzp.on(
        "payment.failed",
        (response: any) => {
          console.error(
            "Payment Failed:",
            response
          );

          toast.error(
            response.error.description ||
            "Payment failed"
          );
        }
      );

      rzp.open();
    } catch (error: any) {
      console.error(
        "Create Order Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while initiating payment."
      );
    }
  };
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    // Remove this block if email is optional
    if (!form.email.trim()) {
      toast.error("Please enter email");
      return;
    }
    if (!form.countryCode.startsWith("+")) {
      toast.error("Country code must start with '+'");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!form.sessionType) {
      toast.error("Please select session type");
      return;
    }
   
if (form.concern.trim() && form.concern.trim().length < 5) {
  toast.error("Concern / Focus Area must be at least 5 characters");
  return;
}

    let calculatedAmount = 0;

    if (
      serviceName === "Meditation" &&
      session
    ) {
      calculatedAmount =
        meditationSessionPricing.get(session) || 0;
    } else if (
      serviceName === "Vastu" &&
      session
    ) {
      calculatedAmount =
        vastuSessionPricing.get(session) || 0;
    } else {
      calculatedAmount =
        servicePricing.get(form.selectedService) || 0;
    }

    setAmount(calculatedAmount);
    setIsSubmitted(true);

    setTimeout(() => {
      paymentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      selectedService: serviceName,
      selectedGuide: guide,
    }));
  }, [serviceName, guide]);


  return (
    <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.h2
        className="text-xl md:text-2xl text-[#2f2a25] mb-1"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        Step 2: Enter Your Details
      </motion.h2>
      <motion.p
        className="text-sm md:text-lg text-[#736345]/70 mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        Please fill in your details to proceed with booking
      </motion.p>

      {/* Card */}
      <motion.div
        className="bg-[#e9dac9] rounded-3xl px-4 md:px-8 py-8 w-full overflow-hidden"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col gap-5 w-full">

          {/* Full Name */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm text-[#736345] font-medium">
              Full Name*
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-sm text-[#736345] font-medium">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40"
              />
            </div>
           <div className="flex flex-col gap-1 min-w-0"> 
            <label className="text-sm text-[#736345] font-medium"> Phone Number* </label>
             <div className="flex gap-2 min-w-0"> 
              <input type="text" name="countryCode" 
                value={form.countryCode} 
                onChange={handleChange} 
                className="w-14 flex-shrink-0 bg-white rounded-lg px-2 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40 text-center"
               /> 
              <input type="tel" name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40" 
              /> 
              </div> 
              </div>
          </div>

          {/* Selected Service + Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-sm text-[#736345] font-medium">
                Selected Service
              </label>
              <input
                type="text"
                value={form.selectedService}
                readOnly
                className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent cursor-default"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-sm text-[#736345] font-medium">
                Selected Guide
              </label>
              <input
                type="text"
                value={form.selectedGuide}
                readOnly
                className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent cursor-default"
              />
            </div>
          </div>

          {/* Session Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#736345] font-medium">
              Session Type*
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <label className="flex items-center gap-2 text-sm text-[#736345] cursor-pointer">
                <input
                  type="radio"
                  name="sessionType"
                  value="online"
                  checked={form.sessionType === "online"}
                  onChange={handleChange}
                  className="accent-[#736345]"
                />
                Online (Zoom / Google Meet)
              </label>
              <label className="flex items-center gap-2 text-sm text-[#736345] cursor-pointer">
                <input
                  type="radio"
                  name="sessionType"
                  value="offline"
                  checked={form.sessionType === "offline"}
                  onChange={handleChange}
                  className="accent-[#736345]"
                />
                Offline (Studio)
              </label>
            </div>
          </div>

          {/* Preferred Time & Date
          <div className="flex flex-col gap-1 w-full border-2 border-black">
            <label className="text-sm text-[#736345] font-medium">
              Preferred Time & Date
            </label>
            <input
              type="datetime-local"
              name="preferredDateTime"
              value={form.preferredDateTime}
              onChange={handleChange}
              className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40"
            />
          </div> */}

          {/* Concern / Focus Area */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm text-[#736345] font-medium">
              Concern / Focus Area*
            </label>
            <textarea
              name="concern"
              value={form.concern}
              onChange={handleChange}
              rows={4}
              className="w-full min-w-0 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-transparent focus:border-[#736345]/40 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#3f5c4a] hover:bg-[#162d22] text-white font-medium py-3 rounded-xl text-sm transition-colors duration-200"
          >
            Submit
          </button>

          <p className="text-center text-xs text-[#736345]/60">
            You'll be redirected to Payment securely
          </p>
        </div>
      </motion.div>
      {isSubmitted && (
        <div ref={paymentRef}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 py-8"
          >
            {/* Header */}
            <h2 className="text-xl md:text-2xl text-[#2f2a25] mb-1">
              Step 3: Payment Summary
            </h2>
            <p className="text-sm md:text-lg text-[#736345]/70 mb-6">
              Complete your payment to confirm your booking
            </p>

            {/* Card */}
            <div className="bg-[#e9dac9] rounded-3xl px-4 py-6">
              <div className="flex flex-col gap-3 text-[#2f2a25] text-sm md:text-base">

                <span className="font-semibold text-lg mb-2">Payment Summary</span>

                <div className="flex justify-between">
                  <span className="text-[#736345]">Service:</span>
                  <span>{form.selectedService || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#736345]">Guide:</span>
                  <span>{form.selectedGuide || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#736345]">Mode:</span>
                  <span>
                    {form.sessionType === "online"
                      ? "Online (Zoom / Google Meet)"
                      : form.sessionType === "offline"
                        ? "Offline (Studio)"
                        : "—"}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Amount:</span>
                  <span>Rs {amount}/-</span>
                </div>

                {/* Buttons */}
                <button onClick={handleCreateOrder} className="mt-4 bg-[#3f5c4a] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#162d22] transition">
                  Pay
                </button>

                {/* <button className="bg-[#8b6b4a] text-white py-3 rounded-xl text-sm font-medium">
            Pay via Bank Transfer
          </button> */}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cal.com Popup — always mounted so SDK initialises once; `open` drives the modal */}
      {calLink && (
        <SlotSelector
          calLink={calLink}
          open={showCal}
          onClose={() => {
            setShowCal(false);
            if (!slotBooked) {
              toast.warning("You haven't selected a slot yet. You can book your slot anytime using the button below.");
            }
          }}
          onBooked={handleBooked}
          prefill={{
            name: form.fullName,
            email: form.email,
          }}
        />
      )}

      {/* Show 'Book Slot' button if payment done but slot not booked */}
      {paidBookingId && !slotBooked && !showCal && calLink && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowCal(true)}
            className="bg-[#3f5c4a] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-[#162d22] transition-all duration-200 flex items-center gap-2"
          >
            <span>Book Your Slot</span>
          </button>
        </div>
      )}
    </div>
  );
}