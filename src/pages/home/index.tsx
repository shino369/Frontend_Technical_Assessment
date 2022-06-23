import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useState } from "react";
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
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { EffectGrid, InputField } from "components";

const steps = [
  "Fill in your information",
  "Choose a doctor",
  "Choose a timeslot",
];

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  start: Yup.string().required(),
  doctorId: Yup.string().required(),
  date: Yup.string().required(),
});

type FormItem = {
  name: string;
  start: string;
  doctorId: string;
  date: string;
};

export const HomePage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [ready, setReady] = useState(false);

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
      setDoctors(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getDoc();
  }, [getDoc]);

  useEffect(() => {
    setReady(false);
    setTimeout(() => {
      setReady(true);
    }, 500);
  }, [activeStep]);

  const renderGridItem = (doctor: Doctor) => {
    return (
      <div className="card m-2">
        <div className="card-body">
          <h5 className="card-title">Dr. {doctor.name}</h5>
          <div className="card-text">{doctor.address.line_2}</div>
          <div className="card-text">{doctor.address.line_1}</div>
          <div className="card-text">{doctor.address.district}</div>
          <div className="card-text">{doctor.description}</div>
        </div>
      </div>
    );
  };

  const onSubmit = async (
    values: FormItem,
    actions: FormikHelpers<FormItem>
  ) => {
    console.log(values);
    actions.setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 d-flex justify-content-center">
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          width: "100%",
          maxWidth: "1280px",
          minHeight: "calc(80vh - 48px - 3.5rem)",
          maxHeight: "calc(80vh - 48px - 3.5rem)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <div className={`page-header mb-2 ${isMobile ? "px-0" : "px-4 pt-4"}`}>
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
          orientation={`${isMobile ? "vertical" : "horizontal"}`}
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
                  {label}
                </StepLabel>
                {isMobile && (
                  <StepContent>
                    <Typography>{"test test test"}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                )}
              </Step>
            );
          })}
        </Stepper>
        {!isMobile && activeStep === steps.length && (
          <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        )}
        {!isMobile && activeStep !== steps.length && (
          <div style={{ flexGrow: 1 }} className="d-flex flex-column">
            <Formik
              style={{ flexGrow: 1 }}
              initialValues={{
                name: "",
                start: "",
                doctorId: "",
                date: "",
              }}
              validationSchema={Schema}
              onSubmit={onSubmit}
            >
              {({ values }) => (
                <Form
                  style={{ flexGrow: 1 }}
                  className="d-flex flex-column"
                  onChange={() => {}}
                >
                  <Carousel
                    className="pt-4"
                    style={{ flexGrow: 1 }}
                    indicators={false}
                    controls={false}
                    variant="dark"
                    activeIndex={activeStep}
                  >
                    <Carousel.Item>
                      <div className="d-flex align-items-center px-5 justify-content-around">
                        <img
                          src={require("assets/images/typing.png")}
                          alt="First slide"
                          width={400}
                          height={"auto"}
                        />
                        <InputField
                          className="col-4"
                          label="Your Name"
                          name="name"
                          placeholder="Please input your name"
                          type="text"
                          showError
                        />
                      </div>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div className="d-flex align-items-center py-2 px-2">
                        <BSForm.Select
                          className="col"
                          id="district"
                          aria-label="Default select example"
                        >
                          <option disabled value="">
                            Location
                          </option>
                          {doctors.map((doctor) => (
                            <option value={doctor.address.district}>
                              {doctor.address.district}
                            </option>
                          ))}
                        </BSForm.Select>
                      </div>

                      <div
                        className="overflow-auto hideScroll px-4 border-bottom border-top"
                        style={{ maxHeight: "calc(50vh - 48px - 3.5rem)" }}
                      >
                        <EffectGrid
                          checked={ready}
                          data={doctors}
                          children={renderGridItem}
                          effectType={"zoom"}
                        />
                      </div>
                    </Carousel.Item>
                    <Carousel.Item>
                      <InputField
                        name="date"
                        placeholder="Input something..."
                        type="textarea"
                      />
                      <InputField
                        name="start"
                        placeholder="Input something..."
                        type="textarea"
                      />
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

                    <Button
                      color="info"
                      variant="contained"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
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
