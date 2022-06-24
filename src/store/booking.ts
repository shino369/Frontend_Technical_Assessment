import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./index";

interface Booking {
  name: string;
  docName: string;
  location: string;
  start: string;
  doctorId: string;
  date: string;
}

interface BookingState {
  booking: Booking | null;
}

const initialState: BookingState = {
  booking: null,
};

const bookingSlide = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking(state, action: PayloadAction<any>) {
      state.booking = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setBooking } = bookingSlide.actions;
const { reset } = bookingSlide.actions;
export default bookingSlide.reducer;

export const initBooking =
  (booking: any): AppThunk =>
  async (dispatch) => {
    dispatch(reset());
    dispatch(setBooking(initialState.booking));
  };
