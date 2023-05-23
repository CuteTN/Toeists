import { FETCH_USER, FOLLOW_USER } from "../actionTypes";

const userReducer = (user = null, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;
    case FOLLOW_USER:
      return action.payload;
    default:
      return user;
  }
};

export default userReducer;
