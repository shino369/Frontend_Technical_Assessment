import { Doctor, Weekdays } from "models/Doctor";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDoctorList } from "services/DoctorService";
import "./index.scss";
import { useMediaQuery } from "react-responsive";
// mui
import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Carousel, Form as BSForm } from "react-bootstrap";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { EffectGrid, InputField, ShowError } from "components";
import _, { values } from "lodash";
import moment from "moment";
import { DatePicker } from "rsuite";
import { Label } from "reactstrap";
import { useDispatch } from "react-redux";
import { setBooking } from "store/booking";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { addDays, getMinutes } from "rsuite/esm/utils/dateUtils";
import { setLoading } from "store/loading";
import { postBooking } from "services/bookingService";
import { WEEK, WEEKDAYS, WEEKMAPPER } from "models/Booking";
import { useNavigate } from "react-router-dom";

const steps = [
  "Fill in your information",
  "Choose a doctor",
  "Choose a timeslot",
  "Summary",
];

const Schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  docName: Yup.string(), // dummy
  doctorId: Yup.string().required("Please select a doctor"),
  date: Yup.string().required("Please select a date"),
  start: Yup.string().when("date", {
    is: (date: string) => !date || date.length === 0,
    then: Yup.string().required("Please fill in date first"),
    otherwise: Yup.string().required(
      "Please select a timeslot within opening hours"
    ),
  }),
});

type FormItem = {
  name: string;
  docName: string;
  start: string;
  doctorId: string;
  date: string;
};

const CARD_HEIGHT = 100;
const FORM_MAX_WIDTH = "1280px";
const FORM_MAX_HEIGHT = "calc(60vh - 48px - 3.5rem)";
const today = new Date();

export const HomePage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { booking } = useSelector((rootState: RootState) => rootState.booking);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getDoc = useCallback(async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getDoc();
  }, []);

  useEffect(() => {
    setReady(false);
    setTimeout(() => {
      setReady(true);
    }, 200);
  }, [activeStep]);

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
              doctor.name.includes(e.toLocaleUpperCase())
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

  const checkValid = (props: FormikProps<FormItem>) => {
    let valid = false;
    let fields: string[] = [];
    switch (activeStep) {
      case 0:
        valid = props.values.name !== "";
        fields = ["name"];
        break;
      case 1:
        valid = props.values.doctorId !== "";
        fields = ["doctorId"];

        break;
      case 2:
        valid = props.isValid;
        fields = ["start", "date"];
        break;
      default:
        valid = false;
        fields = [];
        break;
    }

    if (valid) {
      // console.log(booking);
      // dispatch(
      //   setBooking({
      //     ...props.values,
      //     docName: selectedDoctor?.name || "",
      //     location: selectedDoctor?.address || "",
      //   })
      // );

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      for (let field of fields) {
        // console.log(field);
        props.setFieldTouched(field, true);
      }
    }
  };

  // const getMin = (props: FormikProps<FormItem>) => {
  //   const availableRange = selectedDoctor!.reformatted_op_hours;
  //   const weekday = moment(props.values.date).weekday();
  //   if (availableRange) {
  //     const start = availableRange[weekday].start;

  //     return moment(start, "H.mm").format("HH:mm");
  //   }
  //   return "";
  // };
  // const getMax = (props: FormikProps<FormItem>) => {
  //   const availableRange = selectedDoctor!.reformatted_op_hours;
  //   const weekday = moment(props.values.date).weekday();
  //   if (availableRange) {
  //     const end = availableRange[weekday].end;

  //     return moment(end, "H.mm").format("HH:mm");
  //   }
  //   return "";
  // };

  const isValidRange = (date: Date, props: FormikProps<FormItem>) => {
    const availableRange = selectedDoctor!.reformatted_op_hours;
    const weekday = moment(props.values.date).weekday();
    const hour = moment(date);

    if (availableRange && availableRange[weekday]) {
      const start = moment(availableRange[weekday]?.start, "H.mm");
      const end = moment(availableRange[weekday]?.end, "H.mm");
      // console.log(hour);
      // console.log(start);
      // console.log(end);
      if (hour.isAfter(start) && hour.isBefore(end)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const isValidHour = (hour: number, props: FormikProps<FormItem>) => {
    const availableRange = selectedDoctor!.reformatted_op_hours;
    const weekday = moment(props.values.date).weekday();

    if (availableRange && availableRange[weekday]) {
      if (
        hour < parseInt(availableRange[weekday]?.start.split(".")[0]) ||
        hour > parseInt(availableRange[weekday]?.end.split(".")[0])
      ) {
        return true;
      }
    }
    return false;
  };

  const notAvailable = (
    date: Date | undefined,
    props: FormikProps<FormItem>
  ) => {
    // console.log(moment(date).weekday());

    if (moment(date).isBefore(new Date())) {
      return true;
    }

    const doc = allDoctors.find(
      (doctor) => doctor.id === props.values.doctorId
    );
    // doc!.notAvailableDays = [1,2,3]    // check if work by test data

    if (doc && doc.notAvailableDays) {
      if (doc.notAvailableDays.length === 0) {
        return false;
      } else {
        return doc.notAvailableDays.includes(moment(date).weekday());
      }
    }

    return false;
  };

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
            src={require(`assets/images/isha_${
              index % 2 === 0 ? "m" : "f"
            }.png`)}
            height={CARD_HEIGHT}
            alt="isha"
          ></img>
        </div>
      </div>
    );
  };

  const onSubmit = async (
    values: FormItem,
    actions: FormikHelpers<FormItem>
  ) => {
    console.log(values);
    dispatch(setLoading(true));
    // setLoading(true);
    try {
      const res = await postBooking({
        ...values,
        start: parseInt(values.start.split(":")[0]),
      });
      console.log(res);
      // setLoading(false);
      dispatch(setLoading(false));
      navigate("/record");
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
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
          <strong>DOCTOR BOOKING</strong>
        </div>
        <Stepper
          sx={{
            "& .Mui-active": {
              "& .MuiStepConnector-line": {
                borderColor: "#ff6ba7 !important",
              },
            },
            "& .Mui-completed": {
              "& .MuiStepConnector-line": {
                borderColor: "#ff6ba7 !important",
              },
            },
            p: isMobile ? 0 : 3,
          }}
          activeStep={activeStep}
          orientation="horizontal"
        >
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel
                  sx={{
                    "& .Mui-active": {
                      color: "#ff6ba7 !important",
                    },
                    "& .Mui-completed": {
                      color: "#ff6ba7 !important",
                    },
                  }}
                  {...labelProps}
                >
                  {isMobile && index === activeStep ? label : isMobile ? "" : label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep !== steps.length && (
          <div className="d-flex flex-column flex-grow-1">
            <Formik
              initialValues={{
                name: "",
                start: "",
                docName: "",
                doctorId: "",
                date: "",
              }}
              validationSchema={Schema}
              onSubmit={onSubmit}
            >
              {(props) => (
                <Form
                  className="d-flex flex-column flex-grow-1"
                  onChange={() => {}}
                >
                  <Carousel
                    className="flex-grow-1"
                    indicators={false}
                    controls={false}
                    variant="dark"
                    activeIndex={activeStep}
                  >
                    <Carousel.Item>
                      <div className="d-flex flex-column flex-sm-row align-items-center px-sm-5 justify-content-around">
                        <img
                          src={require("assets/images/typing.png")}
                          alt="First slide"
                          width={"50%"}
                          height={"auto"}
                        />
                        <div className={`col-sm-4 col ${isMobile? "w-100":""}`}>
                          <InputField
                            label="Your Name"
                            name="name"
                            placeholder="Please input your name"
                            type="text"
                            showError
                          />
                        </div>
                      </div>
                    </Carousel.Item>
                    <Carousel.Item>
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
                              <option
                                key={index}
                                value={doctor.address.district}
                              >
                                {doctor.address.district}
                              </option>
                            )
                          )}
                        </BSForm.Select>
                        <InputField
                          onInputChange={(e: string) => {
                            // console.log(e);
                            searchDoctor(e);
                          }}
                          className="col me-4"
                          name="docName"
                          placeholder="Input doctor name to search"
                          type="text"
                        />
                      </div>
                      <ShowError
                        className="ms-4 ps-2"
                        props={props}
                        message={props.errors.doctorId || "-"}
                        field={"doctorId"}
                      />

                      <div
                        className="overflow-auto hideScroll px-4 py-2 border-bottom border-top mb-2"
                        style={{ maxHeight: isMobile ? "" : FORM_MAX_HEIGHT }}
                      >
                        <EffectGrid
                          isMobile={isMobile}
                          checked={ready}
                          data={doctors}
                          selected={props.values.doctorId}
                          onSelect={(id) => {
                            // console.log(id);
                            if (props.values.doctorId !== id) {
                              props.setFieldValue("doctorId", id);
                              setSelectedDoctor(
                                allDoctors.find((doctor) => doctor.id === id)
                              );
                            } else {
                              props.setFieldValue("doctorId", "");
                              setSelectedDoctor(null);
                            }
                          }}
                          children={renderGridItem}
                          effectType={"zoom"}
                        />
                      </div>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div className="d-flex flex-column flex-sm-row align-items-center px-sm-5 justify-content-around">
                        <img
                          src={require("assets/images/yoyaku.png")}
                          alt="First slide"
                          width={"50%"}
                          height={"auto"}
                        />
                        <div className={`col-sm-4 col ${isMobile? "w-100":""}`}>
                          <div className="d-flex">
                            <div className="me-4">
                              <strong>Dr. {selectedDoctor?.name}</strong>
                            </div>
                            <div className="col">
                              {WEEK.map((day, index) => (
                                <div key={index} className="d-flex">
                                  <div className="col">{day}:</div>
                                  <div className="">
                                    {
                                      selectedDoctor?.reformatted_op_hours[
                                        index
                                      ]?.start
                                    }
                                    -
                                    {
                                      selectedDoctor?.reformatted_op_hours[
                                        index
                                      ]?.end
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-2">
                            <Label>date</Label>
                            <DatePicker
                              name="date"
                              onChange={(date) => {
                                props.setFieldValue(
                                  "date",
                                  date ? moment(date).format("YYYY-MM-DD") : ""
                                );
                              }}
                              disabledDate={(date) => notAvailable(date, props)}
                              style={{ width: "100%" }}
                            />
                            <ShowError
                              props={props}
                              message={props.errors.date || "-"}
                              field={"date"}
                            />
                          </div>

                          <div>
                            <Label>Time</Label>
                            <DatePicker
                              disabled={props.values.date === ""}
                              name="start"
                              onChange={(date) => {
                                if (date && isValidRange(date, props)) {
                                  props.setFieldValue(
                                    "start",
                                    date ? moment(date).format("HH:mm") : ""
                                  );
                                } else {
                                  props.setFieldValue("start", "");
                                }
                              }}
                              format="HH:mm"
                              ranges={[]}
                              hideHours={(hour) => isValidHour(hour, props)}
                              hideMinutes={(minute) => {
                                return minute % 60 !== 0;
                              }}
                              style={{ width: "100%" }}
                            />

                            <ShowError
                              props={props}
                              message={props.errors.start || "-"}
                              field={"start"}
                            />
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>

                    <Carousel.Item>
                      <div className="d-flex flex-column flex-sm-row align-items-center px-sm-5 justify-content-around">
                        <img
                          src={require("assets/images/typing.png")}
                          alt="First slide"
                          width={"50%"}
                          height={"auto"}
                        />
                        <div className="col px-4 py-2">
                          {
                            //confirm form data
                          }
                          <div className="d-flex mb-2">
                            <strong className="col-3">Name: </strong>
                            {props.values.name}
                          </div>
                          <div className="d-flex mb-2">
                            <strong className="col-3">Doctor: </strong>
                            {selectedDoctor?.name}
                          </div>
                          <div className="d-flex mb-2">
                            <strong className="col-3">Location:</strong>
                            {`${selectedDoctor?.address.line_2} ${selectedDoctor?.address.line_1} ${selectedDoctor?.address.district} `}
                          </div>
                          <div className="d-flex mb-2">
                            <strong className="col-3">Date: </strong>
                            {props.values.date}
                          </div>
                          <div className="d-flex mb-2">
                            <strong className="col-3">Time: </strong>
                            {props.values.start}
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>
                  </Carousel>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pt: 2,
                      p: isMobile ? 0 : 4,
                    }}
                  >
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep < steps.length - 1 && (
                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          checkValid(props);
                        }}
                      >
                        Next
                      </Button>
                    )}{" "}
                    {activeStep === steps.length - 1 && (
                      <Button
                        color="info"
                        type="submit"
                        variant="contained"
                        onClick={() => {
                          checkValid(props);
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </Box>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </Paper>
    </div>
  );
};
