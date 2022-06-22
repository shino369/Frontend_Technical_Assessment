import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store";
// import { useAuthState } from "app/hooks/commonHook";
interface Props {
  component: any;
  protectedRoute: boolean;
}

const ProtectedRoute = ({ component, protectedRoute }: Props) => {
  const { isAuthenticated } = useSelector(
    (rootState: RootState) => rootState.auth
  );
//   useAuthState()

  if (!isAuthenticated && protectedRoute) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default ProtectedRoute;
