import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useState } from "react";
import { getDoctorList } from "services/DoctorService";
import "./index.scss";

export const HomePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const getDoc = useCallback(async () => {
    const data  = await getDoctorList();
    setDoctors(data);
  }, []);

  useEffect(() => {
    getDoc()
  }, [getDoc]);


  return (
    <div className="p-4">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>Doctor Booking</strong>
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


      <div className="d-flex flex-column justify-content-center">
          {doctors.map((doctor, index) => (
            //table
            <div className="card m-2" key={index}>
              <div className="card-body">
                <h5 className="card-title">{doctor.name}</h5>
                <p className="card-text">{doctor.address.district + doctor.address.line_1 + doctor.address.line_2}</p>
                <p className="card-text">{doctor.description}</p>
                {doctor.opening_hours.map((opening, index) => (
                  <p className="card-text" key={index}>{opening.day + ": from " + opening.start + " to " + opening.end}</p>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
