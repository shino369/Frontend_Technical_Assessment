export interface Doctor {
  id: number;
  address: Address;
  description: string;
  name: string;
  opening_hours: OpeningHours[];
}

export interface Address {
  district: string;
  line_1: string;
  line_2: string;
}

export interface OpeningHours {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  end: string;
  isClosed: boolean;
  start: string;
}
