import React from "react";
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/authenticationContext";
import { TokenService } from "../services/TokenService";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { accessToken } = useAuth()
  const { pathname } = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    if (accessToken === null)
      history.replace(`/signin?url=${encodeURIComponent(pathname)}`);
  }, [accessToken])

  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />
      }}
    ></Route>
  );
}