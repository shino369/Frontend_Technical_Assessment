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
  start: string | number;
  doctorId: string;
  date: string;
}

export enum WEEKDAYS {
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
  SUN,
}
export const WEEKMAPPER = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
};

export const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];