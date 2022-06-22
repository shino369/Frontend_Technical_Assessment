import React from "react";
import "./index.scss";

export const HomePage = () => {

  return (
    <div className="p-4">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>Welcome</strong>
      </div>
      <div className="gs_reveal gs_reveal_fromLeft">
        <p>This is a temp page</p>

        <p
          className="remark"
          style={{
            fontSize: "0.8rem",
          }}
        >
          {
            "( this is a temp page. )"
          }
        </p>
      </div>

      <hr />


      <div className="d-flex justify-content-center position-relative">
        <img
          width={"100%"}
          height={"auto"}
          style={{
            maxWidth: "500px",
          }}
          src="https://c.tenor.com/a5MVWtIRNFUAAAAC/genba-neko.gif"
          alt=""
        />
      </div>
    </div>
  );
};
