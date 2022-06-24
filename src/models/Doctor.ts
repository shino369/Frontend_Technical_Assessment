export interface Doctor {
  id: string;
  address: Address;
  description: string;
  name: string;
  opening_hours: OpeningHours[];
  notAvailableDays?: number[];
  reformatted_op_hours: OpeningHours;
}

export interface OpeningHours {
  [key: number]:  StartEnd;
}

export interface StartEnd {
  start: string;
  end: string;
}
export interface Address {
  district: string;
  line_1: string;
  line_2: string;
}

export type Weekdays = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface OpeningHours {
  day: Weekdays;
  end: string;
  isClosed: boolean;
  start: string;
}
