import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface Props {
  className?: string;
}
const SpinnerComponent: React.FC<Props> = ({ className }) => {
  const { loading } = useSelector((state: RootState) => state.loading);
  return (
    <div
        className={`${loading? 'd-flex': 'd-none'}`}
      style={{
        position: "fixed",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(2px)",
        top: 0,
        zIndex: 1030,
      }}
    >
      <div style={{ transform: "scale(3)", opacity: 0.5 }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
};

export default SpinnerComponent;
