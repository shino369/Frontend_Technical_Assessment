import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDoctorList } from "services/DoctorService";
import "./index.scss";
import { useMediaQuery } from "react-responsive";
import { Paper } from "@mui/material";
import { Form as BSForm } from "react-bootstrap";
import { ConfirmDialog, EffectGrid } from "components";
import _ from "lodash";
import { Input } from "rsuite";
import { useDispatch } from "react-redux";
import { setLoading } from "store/loading";
import { useNavigate } from "react-router-dom";
import { WEEKDAYS, WEEKMAPPER } from "models/Booking";

const CARD_HEIGHT = 100;
const FORM_MAX_WIDTH = "1280px";
const FORM_MAX_HEIGHT = "calc(60vh - 48px - 3.5rem)";

export const DoctorListPage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [location, setLocation] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDoc = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getDoctorList();
      const _data = data.map((item) => ({
        ...item,
        notAvailableDays: item.opening_hours
          .filter((_item) => _item.isClosed)
          .map((__item) => WEEKDAYS[__item.day]),
        reformatted_op_hours: Object.assign(
          {},
          ...item.opening_hours.map((_item) => ({
            [WEEKMAPPER[_item.day]]: { start: _item.start, end: _item.end },
          }))
        ),
      }));
      // console.log(_data);
      setDoctors(_data);
      setAllDoctors(_data);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      dispatch(setLoading(false));
      setErrorMessage(
        `Failed to get doctor list : ${error?.message}. Try again?`
      );
      setShowDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location === "all") {
      setDoctors(allDoctors);
    } else {
      setDoctors(
        allDoctors.filter((doctor) =>
          doctor.address.district.includes(location)
        )
      );
    }
  }, [allDoctors, location]);

  const searchDoctor = useMemo(
    () =>
      _.debounce(
        (e: string) => {
          setDoctors(
            allDoctors.filter((doctor) =>
              doctor.name.toUpperCase().includes(e.toUpperCase())
            )
          );
        },
        300,
        {
          trailing: true,
        }
      ),
    [allDoctors]
  );

  const renderGridItem = (doctor: Doctor, index: number) => {
    return (
      <div
        className="card m-2 pointer hover-opacity"
        style={{ minHeight: "200px" }}
      >
        <div className="card-body d-flex align-items-center">
          <div className="col">
            <h5 className="card-title">Dr. {doctor.name}</h5>
            <div className="card-text">{doctor.address.line_2}</div>
            <div className="card-text">{doctor.address.line_1}</div>
            <div className="card-text">{doctor.address.district}</div>
            <div className="card-text">{doctor.description}</div>
          </div>
          <img
            src={require(`assets/images/isha_${"m"}.png`)}
            height={CARD_HEIGHT}
            alt="isha"
          ></img>
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
          <strong>DOCTORS</strong>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          <div>
            <div className="d-flex align-items-center justify-content-center pb-2 pt-2 px-2">
              <BSForm.Select
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                value={location}
                className={`${
                  location === "" ? "text-muted" : ""
                } col-3 w-25 mx-4`}
                id="district"
                aria-label="Default select example"
              >
                <option disabled value="">
                  Choose Location
                </option>
                <option value="all">All</option>
                {_.uniqBy(allDoctors, "address.district").map(
                  (doctor, index) => (
                    <option key={index} value={doctor.address.district}>
                      {doctor.address.district}
                    </option>
                  )
                )}
              </BSForm.Select>
              <Input
                onChange={(e: string) => {
                  // console.log(e);
                  searchDoctor(e);
                }}
                className="col me-4 form-control"
                name="docName"
                placeholder="Input doctor name to search"
                type="text"
              />
            </div>

            <div
              className="overflow-auto hideScroll px-4 py-2 border-bottom border-top"
              style={{ maxHeight: isMobile ? "" : FORM_MAX_HEIGHT }}
            >
              <EffectGrid
                isMobile={isMobile}
                checked={true}
                data={doctors}
                onSelect={(id) => {
                  navigate(`/doctor/${id}`);
                }}
                children={renderGridItem}
                effectType={"zoom"}
              />
            </div>
          </div>
        </div>
      </Paper>
      <ConfirmDialog
        open={showDialog}
        title={"Error occurred"}
        message={errorMessage}
        onConfirm={() => {
          setShowDialog(false);
          setErrorMessage("");
          getDoc();
        }}
        onCancel={() => {
          setShowDialog(false);
          setErrorMessage("");
        }}
      />
    </div>
  );
};
