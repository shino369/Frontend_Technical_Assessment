import React from "react";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../icon/Icon";
import { setAuthenticated, setUser } from "store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Hamburger from "hamburger-react";
import "./Topbar.scss";

export interface Props {
  className?: string;
  styles?: any;
  isCollapsed: boolean;
  toggle: () => void;
}

const Topbar: React.FC<Props> = ({
  className,
  styles,
  isCollapsed,
  toggle,
}: Props) => {
  // let location = useLocation();
  // const [recent, setRecent] = React.useState<string>();

  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const navigation = useNavigate();


  return (
    <div
      className={`d-flex w-100 topbar align-items-center transition ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="current ms-2">{'Route'}</div>

      <div className="d-flex user justify-content-end align-items-center position-absolute end-0">
        {user && (
          <>
            {/* <img
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                marginRight: "0.5rem",
              }}
              src={user.photoURL || ""}
              className="avatar"
              alt=""
            /> */}
            <div>{'user'}</div>
            <div className="mx-2">{"|"}</div>
            <div className="pointer me-2" onClick={handleClickOpen}>
              logout
            </div>
          </>
        )}
      </div>
      <div className="d-flex justify-content-end align-items-center position-fixed bottom-0 end-0">
        {[
          { name: "github", url: "https://github.com/shino369" },
          { name: "linkedin", url: "https://www.linkedin.com/in/aw3939" },
          { name: "whatsapp", url: "https://wa.me/85252362806" },
          { name: "email", url: "mailto:anthonywong3939@gmail.com" },
        ].map((icon, index) => (
          <Icon
            button
            btnClassName="px-2 hover-opacity"
            onClick={() => {
              window.open(icon.url, "_blank");
            }}
            key={index}
            extname="png"
            name={icon.name}
            size={24}
            color={"white"}
          />
        ))}
      </div>
    </div>
  );
};

export default Topbar;
