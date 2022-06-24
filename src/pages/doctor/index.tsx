import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useState } from "react";
import { getDoctor } from "services/DoctorService";
import "./index.scss";
import { useMediaQuery } from "react-responsive";
// mui
import { Paper } from "@mui/material";

import _, { values } from "lodash";
import moment from "moment";

import { useDispatch } from "react-redux";
import { setLoading } from "store/loading";
import { useLocation } from "react-router-dom";
import { WEEK } from "models/Booking";

enum WEEKDAYS {
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
  SUN,
}
const WEEKMAPPER = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
};

const CARD_HEIGHT = 100;
const FORM_MAX_WIDTH = "1280px";

export const DoctorPage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [doctor, setDoctor] = useState<Doctor>();
  const dispatch = useDispatch();
  const location = useLocation();
  const paths = location.pathname.split("/");
  const [id] = useState<string>(paths[paths.length - 1]);

  const getDoc = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getDoctor(id);
      data.notAvailableDays = data.opening_hours
        .filter((_item) => _item.isClosed)
        .map((__item) => WEEKDAYS[__item.day]);
      data.reformatted_op_hours = Object.assign(
        {},
        ...data.opening_hours.map((_item) => ({
          [WEEKMAPPER[_item.day]]: { start: _item.start, end: _item.end },
        }))
      );
      setDoctor(data);
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    getDoc();
  }, []);

  const renderGridItem = () => {
    return (
      <div className="m-2" style={{ minHeight: "200px" }}>
        <div className="card-body d-flex flex-column flex-sm-row  justify-content-around">
          <div>
            <div className="card-text mb-2">{doctor?.description}</div>
            <h5 className="card-title">Address</h5>
            <div className="card-text">{doctor?.address.line_2}</div>
            <div className="card-text">{doctor?.address.line_1}</div>
            <div className="card-text mb-2">{doctor?.address.district}</div>
            <h5 className="card-title">Opening hours</h5>
            <div className="d-flex">
              <div className="col">
                {WEEK.map((day, index) => (
                  <div key={index} className="d-flex">
                    <div className="col">{day}:</div>
                    <div className="">
                      {doctor?.reformatted_op_hours[index]?.start}-
                      {doctor?.reformatted_op_hours[index]?.end}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <img
              src={require(`assets/images/isha_${"m"}.png`)}
              height={"auto"}
              width={200}
              alt="isha"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 d-flex justify-content-center">
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          width: "100%",
          maxWidth: FORM_MAX_WIDTH,
          // maxHeight: FORM_MAX_HEIGHT,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className={`page-header mb-2 ${
            isMobile ? "px-0" : "px-4 py-4 bg-secondary"
          }`}
        >
          <strong>Dr. {doctor?.name}</strong>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          <div>
            <div className="overflow-auto hideScroll px-sm-4 py-2">
              {renderGridItem()}
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};
