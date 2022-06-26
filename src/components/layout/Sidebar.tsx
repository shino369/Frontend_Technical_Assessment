import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";
import "./Sidebar.scss";
import Hamburger from "hamburger-react";

import { Icon } from "components/icon";
import { userRoutes } from "routes/Routing";

export interface Props {
  className?: string;
  routeName?: string;
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
}

const Sidebar: React.FC<Props> = ({
  className,
  routeName,
  toggle,
  isCollapsed,
  close,
}) => {
  // let location = useLocation();
  const [activeRoute, setActiveRoute] = React.useState(routeName);

  useEffect(() => {
    setActiveRoute(routeName);
    close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName]);


  return (
    <div
      className={`${
        isCollapsed ? "collapsed" : "expanded"
      } bg-secondary sidebar px-0 d-flex flex-column fixed-sidebar`}
    >
      <div
        className={`sidebar-header border-right d-flex justify-content-start ${
          isCollapsed ? "px-1" : "ps-4 pe-2"
        } py-2`}
      >
        <div className="sidebar-header-logo"></div>
        <div
          className={`d-flex w-100 header align-items-center justify-content-between  ${
            isCollapsed ? "hide" : "show"
          }`}
        >
          <div className="outer-wrapper d-flex">
            <div className="wrapper">
              <span className="hello">Necktie Doctor Booking</span>
            </div>

          </div>
          <div className="side-menu">
            <Hamburger toggled={!isCollapsed} toggle={toggle} />
          </div>
        </div>
      </div>
      <div className={`sidebar-body hideScroll`}>
        <div className="sidebar-body-item d-flex flex-column j  ustify-content-start">
          {userRoutes
            .filter((f) => f.group !== "hidden")
            .map((route, i) => (
              <NavLink
                key={i}
                style={{
                  textDecoration: "none",
                }}
                to={route.path}
              >
                <div
                  className={`${isCollapsed ? "px-1" : "px-4"} ${
                    activeRoute === route.name ? "active" : ""
                  } label text-uppercase py-3 d-flex align-items-center position-relative`}
                >
                  <div
                    className={`position-absolute d-flex justify-content-center transition ${
                      isCollapsed ? "opacity-1" : "opacity-0"
                    }`}
                    style={{
                      transform: `translateX(${isCollapsed ? "0" : "-10px"})`,
                      width: `calc(100% - ${isCollapsed ? "0.5rem" : "3rem"})`,
                    }}
                  >
                    <Icon svg name={route.icon} size={24} color={"white"} />
                  </div>

                  <div
                    className={`${isCollapsed ? "hide" : "show"} label-text`}
                  >
                    {route.name}
                  </div>
                </div>
              </NavLink>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
