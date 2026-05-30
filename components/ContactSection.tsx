"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    concern: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  // Remove spaces and non-digits
  const phone = formData.phoneNumber.replace(/\D/g, "");

  // Email validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  // Indian 10-digit mobile validation
  if (!/^[1-9]\d{9}$/.test(phone)) {
    toast.error("Please enter a valid 10-digit mobile number");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      Full_Name: formData.fullName,
      Email: formData.email,
      Phone_Number: `${formData.countryCode} ${phone}`,
      Concern_Focus_Area: formData.concern,
    };

    const response = await fetch(
      `https://formsubmit.co/ajax/${process.env.NEXT_PUBLIC_EMAIL_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Request submitted successfully!");

      setFormData({
        fullName: "",
        email: "",
        countryCode: "+91",
        phoneNumber: "",
        concern: "",
      });
    } else {
      toast.error("Failed to submit request");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="w-full pt-4 pb-8 px-4 md:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl leading-tight font-canela text-[#4F6756]">
              Let’s connect
              <br />
              with Intentions
            </h2>

            <p className="mt-6 text-[#2F2F2F] text-base leading-7 max-w-md">
              Whether you're seeking clarity, balance, or deeper alignment,
              this is your space to begin.
              <br />
              Share what’s on your mind, and let’s explore your next step
              together
            </p>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-3">
            <MessageCircle className="w-6 h-6 text-[#4F6756] mt-1" />

            <div>
              <h3 className="font-semibold text-xl text-black">WhatsApp</h3>
              <p className="text-[#2F2F2F] mt-1">
                Let’s talk heart-to-heart
              </p>

              <a
                href="tel:+919811237999"
                className="underline text-[#2F2F2F] mt-1 inline-block"
              >
                (+91) 9811237999
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-[#4F6756] mt-1" />

            <div>
              <h3 className="font-semibold text-xl text-black">Email</h3>

              <p className="text-[#2F2F2F] mt-1">
                Write to us anytime
              </p>

              <a
                href="mailto:info@happyho.in"
                className="underline text-[#2F2F2F] mt-1 inline-block"
              >
                info@happyho.in
              </a>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full">
          <form
  className="space-y-5"
  onSubmit={handleSubmit}
>

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-[#7A674C] text-lg">
                Full Name*
              </label>

              <input
  type="text"
  name="fullName"
  value={formData.fullName}
  onChange={handleChange}
  className="w-full h-12 rounded-lg border border-[#8A8A8A] bg-white px-4 outline-none"
/>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-[#7A674C] text-lg">
                Email*
              </label>

              <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  className="w-full h-12 rounded-lg border border-[#8A8A8A] bg-white px-4 outline-none"
/>
            </div>

            {/* Phone */}
           <div>
  <label className="block mb-2 text-[#7A674C] text-lg">
    Phone Number*
  </label>

  <div className="flex gap-2 w-full">
    {/* Country Code */}
   <input
  type="text"
  name="countryCode"
  value={formData.countryCode}
  onChange={handleChange}
  className="w-20 min-w-[80px] h-12 rounded-lg border border-[#8A8A8A] bg-white px-2 outline-none"
/>

    {/* Phone Number */}
<input
  type="text"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
  placeholder="Enter phone number"
  className="flex-1 min-w-0 h-12 rounded-lg border border-[#8A8A8A] bg-white px-4 outline-none"
/>
  </div>
</div>

            {/* Concern */}
            <div>
              <label className="block mb-2 text-[#7A674C] text-lg">
                Concern / Focus Area*
              </label>

             <textarea
  rows={4}
  name="concern"
  value={formData.concern}
  onChange={handleChange}
  className="w-full rounded-lg border border-[#8A8A8A] bg-white p-4 outline-none resize-none"
/>
            </div>

            {/* Button */}
           <button
  type="submit"
  disabled={loading}
  className="bg-[#4F6756] hover:bg-[#425746] transition-all text-white px-8 h-14 rounded-full border-2 border-[#D89C2B] text-lg font-medium disabled:opacity-50"
>
  {loading
    ? "Submitting..."
    : "Book Discovery Session"}
</button>
          </form>
        </div>
      </div>
    </section>
  );
}