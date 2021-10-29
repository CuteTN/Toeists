import API from "./index";

export const getUserById = (id) => API.get(`api/users/${id}`);
