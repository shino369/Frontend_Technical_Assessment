import { FormikProps } from "formik";
import { useEffect } from "react";

interface Props {
  props: FormikProps<any>;
  field: string;
  message: string;
  className?: string
}

const ShowError: React.FC<Props> = ({ props, field, message,className }) => {

  // useEffect(() => {
  //   if (props.values[field]) {
  //     console.log(props.getFieldMeta(field));
  //   }
  // }, [field, message, props]);

  return (
    <div
      style={{
        opacity:
          props.errors[field] && props.getFieldMeta(field).touched
            ? 1
            : 0,
      }}
      className={`transition text-danger pb-2 ${className}`}
    >
      {message}
    </div>
  );
};
export default ShowError;
