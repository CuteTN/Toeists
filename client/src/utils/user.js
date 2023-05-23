import { useAuth } from "../contexts/authenticationContext";
import * as api from "./../services/api/user";
import { useState } from "react";
export const isLoginUser = (user) => {
  const { signedInUser } = useAuth();
  return user?._id === signedInUser?._id;
};

export const checkFollow = (user) => {
  const { signedInUser } = useAuth();
  const [result, setResult] = useState(false);

  api
    .getUserConnections(signedInUser?._id)
    .then((res) => {
      res.data.followingUserIds.forEach((id) => {
        if (id === user?._id) setResult(true);
      });
    })
    .catch((e) => {
      console.log(e);
    });

  return result;
};

export const checkBlock = (user) => {
  const { signedInUser } = useAuth();
  const [result, setResult] = useState(false);

  api
    .getUserConnections(signedInUser?._id)
    .then((res) => {
      res.data.blockingUserIds.forEach((id) => {
        if (id === user?._id) setResult(true);
      });
    })
    .catch((e) => {
      console.log(e);
    });

  return result;
};
