import React, { useEffect } from "react";
// import { RootState } from "store";
// import { useDispatch, useSelector } from "react-redux";
// import Icon from "../icon/Icon";
// import { setAuthenticated, setUser } from "store/auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import Hamburger from "hamburger-react";
import "./Topbar.scss";

export interface Props {
  className?: string;
  routeName: string;
  styles?: any;
  isCollapsed: boolean;
  toggle: () => void;
}

const Topbar: React.FC<Props> = ({
  className,
  routeName,
  styles,
  isCollapsed,
  toggle,
}: Props) => {

  const [activeRoute, setActiveRoute] = React.useState(routeName);

  useEffect(() => {
    setActiveRoute(routeName);
  }, [routeName]);

  return (
    <div
      className={`d-flex w-100 topbar align-items-center transition ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="current ms-2">{activeRoute.toUpperCase()}</div>

      <div className="d-flex user justify-content-end align-items-center position-absolute end-0">

      </div>
    </div>
  );
};

export default Topbar;
