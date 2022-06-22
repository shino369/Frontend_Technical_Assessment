import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useState } from "react";
import { getDoctorList } from "services/DoctorService";
import "./index.scss";
import { useMediaQuery } from "react-responsive";
// mui
import {
  Box,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

const steps = [
  "Fill in your information",
  "Choose a doctor",
  "Choose a timeslot",
];

export const HomePage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [activeStep, setActiveStep] = React.useState(0);

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
    const data = await getDoctorList();
    setDoctors(data);
  }, []);

  useEffect(() => {
    getDoc();
  }, [getDoc]);

  return (
    <div className="p-4">
      <div className="page-header mb-2">
        <strong>DOCTOR BOOKING</strong>
      </div>

      <hr />

      <Box sx={{ width: "100%" }}>
        <Stepper
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
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        )}
        {!isMobile && activeStep !== steps.length && (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, mx: 1 }}>
              Step {activeStep + 1}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};
