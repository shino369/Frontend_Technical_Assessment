import { LazyHome } from "pages";
import { LazyDoctor } from "pages/doctor/lazy";
import { LazyDoctorList } from "pages/doctorlist/lazy";
import { Navigate } from "react-router-dom";
interface Route {
  name: string;
  icon: string;
  group: string;
  path: string;
  component: any;
  exact?: boolean;
  children?: Route[];
}
const userRoutes: Route[] = [
  {
    name: "home",
    icon: "appoint",
    group: "",
    path: "/",
    component: <LazyHome />,
  },
  {
    name: "doctor list",
    icon: "doctor",
    group: "",
    path: "/doctorlist",
    component: <LazyDoctorList />,
  },
  {
    name: "doctor",
    icon: "house-fill",
    group: "hidden",
    path: "/doctor/:id",
    component: <LazyDoctor />,
  },
  // 404
  {
    name: "404",
    icon: "",
    group: "hidden",
    path: "*",
    component: <Navigate to="/" replace={true} />,
  },
];

export { userRoutes };
