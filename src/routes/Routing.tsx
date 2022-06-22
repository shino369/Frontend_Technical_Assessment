import { LazyHome } from "pages";
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
    icon: "house-fill",
    group: "",
    path: "/",
    component: <LazyHome />,
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
