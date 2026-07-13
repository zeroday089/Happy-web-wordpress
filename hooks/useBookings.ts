import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";

export const BOOKINGS_KEY = ["bookings"] as const;

export const useBookings = () => {
  return useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: bookingService.getAllBookings,
    staleTime: 1000 * 60 * 2,      // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,                  // only fetch if id exists
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};