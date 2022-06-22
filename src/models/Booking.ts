export interface Booking {
  id: string;
  name: string;
  start: string;
  doctorId: string;
  date: string;
  status: string;
}

export interface BookingRequest {
  name: string;
  start: string;
  doctorId: string;
  date: string;
}
