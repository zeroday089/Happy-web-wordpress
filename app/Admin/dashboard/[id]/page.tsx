"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Mail, Phone, User, Wifi, MapPin,
  CalendarDays, Stethoscope, UserCheck, MessageSquare, CreditCard,
} from "lucide-react";
import { useBookingById } from "@/hooks/useBookings";

interface Payment {
  orderId: string;
  paymentId: string | null;
  status: "pending" | "paid" | "failed";
  amount: number;
  paidAt: string;
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/Admin/login");
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  const { data: booking, isLoading, error } = useBookingById(id as string);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const paymentStatusClass = (status: string) => {
    switch (status) {
      case "paid":    return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "pending": return "bg-yellow-950 text-yellow-400 border-yellow-800";
      case "failed":  return "bg-red-950 text-red-400 border-red-800";
      default:        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  // Cast payment since service Booking type doesn't have it — extend if needed
  const payment = (booking as any)?.payment as Payment | null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Bookings
      </Button>

      {/* Error */}
      {error && (
        <div className="text-red-400 text-sm bg-red-950/40 border border-red-800 rounded-md px-4 py-3 mb-6">
          {(error as any)?.response?.data?.message || "Failed to fetch booking"}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : booking ? (
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">{booking.fullName}</h1>
              <p className="text-zinc-600 text-xs mt-1 font-mono">{booking._id}</p>
            </div>
            {payment && (
              <Badge variant="outline" className={paymentStatusClass(payment.status)}>
                {payment.status}
              </Badge>
            )}
          </div>

          {/* Contact Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 w-32 shrink-0">Email</span>
                <span>{booking.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 w-32 shrink-0">Phone</span>
                <span>{booking.phoneNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-300">
                <Stethoscope className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 w-32 shrink-0">Service</span>
                <span>{booking.selectedService}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <UserCheck className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 w-32 shrink-0">Guide</span>
                <span>{booking.selectedGuide}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                {booking.sessionType === "Online"
                  ? <Wifi className="h-4 w-4 text-zinc-500 shrink-0" />
                  : <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                }
                <span className="text-zinc-500 w-32 shrink-0">Session Type</span>
                <Badge
                  variant="outline"
                  className={
                    booking.sessionType === "Online"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-amber-950 text-amber-400 border-amber-800"
                  }
                >
                  {booking.sessionType === "Online"
                    ? <Wifi className="h-3 w-3 mr-1" />
                    : <MapPin className="h-3 w-3 mr-1" />
                  }
                  {booking.sessionType}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <CalendarDays className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 w-32 shrink-0">Preferred Date</span>
                <span>{formatDate(booking.preferredDateTime)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment ? (
                <>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className="text-zinc-500 w-32 shrink-0">Status</span>
                    <Badge variant="outline" className={paymentStatusClass(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className="text-zinc-500 w-32 shrink-0">Amount</span>
                    <span>₹{payment.amount}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className="text-zinc-500 w-32 shrink-0">Paid At</span>
                    <span>{formatDate(payment.paidAt)}</span>
                  </div>
                </>
              ) : (
                <p className="text-zinc-600 text-sm">No payment record found</p>
              )}
            </CardContent>
          </Card>

          {/* Concern Area */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Concern Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 leading-relaxed">{booking.concernArea}</p>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <div className="flex gap-4 text-xs text-zinc-600 px-1 pb-6">
            <span>Booked: {formatDate(booking.createdAt)}</span>
            <span>·</span>
            <span>Updated: {formatDate(booking.updatedAt)}</span>
          </div>

        </div>
      ) : null}
    </div>
  );
}