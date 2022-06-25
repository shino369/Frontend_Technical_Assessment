import { Booking, BookingRequest, PatchBookingRequest } from "models/Booking";
import Axios from ".";

export const getBookingList = async () => {
  const { data } = await Axios.get<Booking[]>(`/booking`);
  return data;
};

export const getBooking = async (id: number) => {
  const { data } = await Axios.get<Booking>(`/booking/${id}`);
  return data;
};

export const postBooking = async (params: BookingRequest) => {
  const { data } = await Axios.post<Booking>(`/booking`, params);
  return data;
};

export const patchBooking = async (id: string, params: PatchBookingRequest) => {
  const { data } = await Axios.patch<Booking>(`/booking/${id}`, params);
  return data;
};
