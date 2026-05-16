import { Booking } from "@/type/api";
import axios from "axios";

export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_ADMIN}`;


const getToken = () => localStorage.getItem("token");

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await axios.get(`${API_BASE}/bookings`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await axios.get(`${API_BASE}/getbookingdatabyid/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      withCredentials: true,
    });
    return response.data.data;
  },
};