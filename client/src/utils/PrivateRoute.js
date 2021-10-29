import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authenticationContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { signedInUser } = useAuth();
  const { pathname } = useLocation();

  return (
    <Route
      {...rest}
      render={(props) => {
        return signedInUser ? <Component {...props} /> : <Redirect to={`/signin?url=${encodeURIComponent(pathname)}`}/>;
      }}
    ></Route>
  );
}
