export const isLoginUser = (user) => {
  const currentUser = JSON.parse(localStorage.getItem("user"))?.result;
  console.log("cur", currentUser?._id);
  console.log("user", user?._id);
  return user?._id === currentUser?._id;
};
