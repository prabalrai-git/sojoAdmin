import jwt_decode from "jwt-decode";

const checkJwtToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (!decoded) {
        logout();
      }
      const current_time = new Date().getTime() / 1000;
      if (current_time > decoded.exp) {
        logout();
      }
      return true;
    } catch (err) {
      logout();
    }
  } else {
    logout();
  }
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("id");
  // window.location.href = "/login";
  return false;
};

export { checkJwtToken, logout };
