import { CommonWrapper, Sidebar, Topbar } from "components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Navigate } from "react-router-dom";
import { RootState } from "store";
// import { useAuthState } from "app/hooks/commonHook";
interface Props {
  component: any;
  routeName: string;
  protectedRoute: boolean;
}

const ProtectedRoute = ({ component, routeName, protectedRoute }: Props) => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  return (
    <CommonWrapper
      className={`col d-flex bg-white route-wrapper ${
        isCollapsed ? "main-ps-5rem" : "main-ps-20rem"
      }`}
    >
      <Sidebar
        routeName={routeName}
        isCollapsed={isCollapsed}
        toggle={() => {
          setIsCollapsed(!isCollapsed);
        }}
        close={() => {
          isMobile && setIsCollapsed(true);
        }}
      />

      <Topbar
        routeName={routeName}
        isCollapsed={isCollapsed}
        toggle={() => {
          setIsCollapsed(!isCollapsed);
        }}
      />
      <div className="common-wrapper">{component}</div>
    </CommonWrapper>
  );
};

export default ProtectedRoute;
