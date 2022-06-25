import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import InputField from "../form/InputField";

interface ConfirmDialogProps {
  open: boolean;
  title: any;
  message: string;
  highlight?: any[];
  withInput?: boolean;
  onConfirm: (input?: string) => void;
  onCancel: () => void;
}

type FormItem = {
  room: string;
};

const schema = yup.object().shape({
  room: yup.string().required().min(3, "must > 3 characters"),
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfimrDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  highlight,
  withInput,
  onConfirm,
  onCancel,
}) => {
  const onSubmit = (values: FormItem, actions: FormikHelpers<FormItem>) => {
    console.log(values);
    onConfirm(values.room);
  };
  const formikRef = React.useRef<any>();

  React.useEffect(() => {
    // reset form
    if (!open && formikRef.current) {
      setTimeout(() => {
        formikRef.current.resetForm();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 0 },
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCancel}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="pt-2 px-3">
        <span style={{ fontSize: "1rem" }}>{title}</span>
      </DialogTitle>
      <DialogContent className={`${withInput ? "pb-0" : ""} px-3`}>
        <div className="d-flex flex-column">
          <div className="mb-2" style={{ fontSize: "1rem" }}>{message}</div>
          {highlight && (
            <div className="w-75 d-flex align-self-center flex-column border p-4">
              {highlight.map((item: any, index: number) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-2"
                  style={{ fontSize: "1rem" }}
                >
                  <strong className="text-capitalize">{item.key}:</strong>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>
          )}
          {withInput && (
            <Formik
              innerRef={formikRef}
              initialValues={{
                room: "",
              }}
              validationSchema={schema}
              onSubmit={onSubmit}
            >
              {({ values, errors, isValid }) => (
                <Form className=" ">
                  <div className="col">
                    <InputField
                      style={{
                        backgroundColor: "rgba(54, 57, 63, 0.8)",
                        border: "none",
                        borderRadius: "0",
                        caretColor: "white",
                        color: "white",
                        resize: "none",
                      }}
                      name="room"
                      placeholder="Input room name"
                      showError
                    />
                  </div>

                  <DialogActions className="justify-content-between px-0">
                    <Button
                      className="px-0 justify-content-start"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="px-0 justify-content-end"
                      disabled={!isValid}
                      type="submit"
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </DialogContent>
      {!withInput && (
        <DialogActions className="justify-content-between px-3">
          <Button className="px-0 justify-content-start" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            className="px-0 justify-content-end"
            onClick={() => {
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ConfimrDialog;
