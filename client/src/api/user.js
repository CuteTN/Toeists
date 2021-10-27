import API from "./index";

export const getUserById = (id) => API.get(`/userinfo/${id}`);
