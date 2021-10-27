import {
  FETCH_USER,
  UPDATE_USER,
  ADD_FRIEND_REQUEST,
  REMOVE_FRIEND_REQUEST,
  UNFRIEND,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../actionTypes";
import * as api from "../../api/user";

export const getUser = (uid, history) => async (dispatch) => {
  try {
    console.log("Thy xinh đẹp");
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
