export interface Booking {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedService: string;
  selectedGuide: string;
  paymentStatus: string;
  sessionType: "Online" | "Offline";
  preferredDateTime: string;
  concernArea: string;
  createdAt: string;
  updatedAt: string;
}


export interface Booking {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedService: string;
  selectedGuide: string;
  paymentStatus: string;
  sessionType: "Online" | "Offline";
  preferredDateTime: string;
  concernArea: string;
  createdAt: string;
  updatedAt: string;
  payment: {
    orderId: string;
    paymentId: string | null;
    status: "pending" | "paid" | "failed";
    amount: number;
    paidAt: string;
  } | null;
}


export interface BookingFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  selectedService: string;
  selectedGuide: string;
  sessionType: "online" | "offline" | "";
  preferredDateTime: string;
  concern: string;
}

export interface BookingDetailsFormProps {
  guide: string;
  serviceName: string;
  session?: string;
}

export const servicePricing = new Map<string, number>([
  ["Tarot Guidance", 3000],
  ["Energy Healing", 7500],
  ["Astrology", 4500],
  ["Numerology", 7500],
  ["Name Correction", 15000],
  ["Conscious Guidance", 15000],
]);

export const meditationSessionPricing = new Map<string, number>([
  ["Single Session: ₹5,000", 5000],
  ["5 Sessions: ₹25,000", 25000],
  ["10 Sessions: ₹45,000", 45000],
]);

export const vastuSessionPricing = new Map<string, number>([
  ["Site Visit: ₹11,000", 11000],
  ["Detailed Report: ₹40,000", 40000],
]);
