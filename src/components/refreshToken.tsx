import { useNavigate } from "react-router-dom";
export const refreshToken = async () => {
  console
  const res = await fetch("/api/v1/auth/refresh");
  if (res.status !== 200) {
    localStorage.removeItem("user");

  }
};

export default refreshToken;
