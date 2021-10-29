import { FETCH_USER } from "../actionTypes";
import * as api from "../../services/api/user";

export const getUser = (uid, history) => async (dispatch) => {
  try {
    await api
      .getUserById(uid)
      .then((res) => dispatch({ type: FETCH_USER, payload: res.data }))
      .catch((error) => {
        if (error.response?.status === 404) history.push("/error404");
      });
  } catch (error) {
    console.log(error);
  }
};
