import { FETCH_USER, FOLLOW_USER, UNFOLLOW_USER } from "../actionTypes";
import * as api from "../../services/api/user";
import * as apiConnections from "../../services/api/userConnection";

export const getUser = (uid, history) => async (dispatch) => {
  try {
    await api
      .getUserById(uid)
      .then((res) => dispatch({ type: FETCH_USER, payload: res.data }))
      .catch((error) => {
        if (error.response?.status === 404) history?.push("/error404");
      });
  } catch (error) {
    console.log(error);
  }
};

export const followUser = (followedId) => async (dispatch) => {
  try {
    const { data } = await apiConnections.follow(followedId);
    dispatch({ type: FOLLOW_USER, payload: data });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
