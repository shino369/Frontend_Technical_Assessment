import Axios from ".";

import { Doctor } from "models/Doctor";

export const getDoctorList = async () => {
  const { data } = await Axios.get<Doctor[]>(`/doctor`);
  return data;
};

export const getDoctor = async (id: number) => {
  const { data } = await Axios.get<Doctor>(`/doctor/${id}`);
  return data;
};
